import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { OAuth2RequestError } from 'arctic';

import { github } from '@/lib/auth/oauth';
import { db } from '@/db';
import { oauthAccount, user } from '@/db/schema';
import { createUserSession } from '@/lib/auth/utils';

type GitHubUser = {
  id: string;
  login: string;
};
type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'private' | 'public' | null;
};

export const GET = async (req: Request) => {
  const url = new URL(req.url),
    code = url.searchParams.get('code'),
    state = url.searchParams.get('state');
  const storedState = cookies().get('github_oauth_state')?.value ?? null;

  if (!code || !state || !storedState || state !== storedState)
    return new Response(null, { status: 400 });

  try {
    const { accessToken } = await github.validateAuthorizationCode(code);
    const githubRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      githubUser: GitHubUser = await githubRes.json();

    const [existingAccount] = await db
      .select()
      .from(oauthAccount)
      .where(
        and(
          eq(oauthAccount.providerId, 'github'),
          eq(oauthAccount.providerUserId, githubUser.id)
        )
      );
    if (existingAccount) {
      await createUserSession(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: { Location: '/' },
      });
    }

    // Email might be private, so need to fetch it separately
    const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      emails: GitHubEmail[] = await emailRes.json(),
      primaryEmail = emails?.find(email => email.primary) ?? null;
    if (!primaryEmail)
      return Response.json(
        {
          success: false,
          message: "Your GitHub user doesn't have a primary email address.",
        },
        { status: 400 }
      );
    if (!primaryEmail.verified)
      return Response.json(
        {
          success: false,
          message: "Your GitHub user's primary email address isn't verified.",
        },
        { status: 400 }
      );
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, primaryEmail.email));

    if (existingUser)
      // TODO: Redirect to login page with error=OAUTH_ACCOUNT_NOT_LINKED & provider=github
      return Response.json(
        {
          success: false,
          message:
            "A user with this email already exists, and isn't linked to this GitHub account.",
        },
        { status: 400 }
      );

    // No existing account, create a new one
    const newUser = await db.transaction(async tx => {
      const [newUser] = await tx
        .insert(user)
        .values({ email: primaryEmail.email, emailVerified: true })
        .returning({ id: user.id, email: user.email });
      await tx.insert(oauthAccount).values({
        providerId: 'github',
        providerUserId: githubUser.id,
        userId: newUser.id,
      });
      return newUser;
    });
    await createUserSession(newUser.id);
    return new Response(null, {
      status: 302,
      headers: {
        // TODO: Custom callback URL
        Location: '/',
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError)
      return Response.json(
        { success: false, message: 'Invalid code.' },
        { status: 400 }
      );
    return Response.json(
      {
        success: false,
        message: 'Something went wrong while trying to sign you in.',
      },
      { status: 500 }
    );
  }
};
