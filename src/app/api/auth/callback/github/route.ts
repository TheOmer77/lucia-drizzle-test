import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';

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

const providerId = 'github';
const redirectWithError = (errorCode: string, req: Request) =>
  Response.redirect(
    new URL(`/sign-in?error=${errorCode}&provider=${providerId}`, req.url)
  );

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
          eq(oauthAccount.providerId, providerId),
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
    if (!primaryEmail) return redirectWithError('OAUTH_ACCOUNT_NO_EMAIL', req);
    if (!primaryEmail.verified)
      return redirectWithError('OAUTH_ACCOUNT_EMAIL_UNVERIFIED', req);

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, primaryEmail.email));
    if (existingUser) return redirectWithError('OAUTH_ACCOUNT_NOT_LINKED', req);

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
  } catch {
    return redirectWithError('SIGNIN_FAILED', req);
  }
};
