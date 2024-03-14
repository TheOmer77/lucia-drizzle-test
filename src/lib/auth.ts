import { cache } from 'react';
import { cookies } from 'next/headers';
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { TimeSpan, createDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { emailVerification, session, user } from '@/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    /** This sets cookies with super long expiration, since Next.js doesn't
     * allow Lucia to extend cookie expiration when rendering pages */
    expires: false,
    attributes: { secure: process.env.NODE_ENV === 'production' },
  },
  getUserAttributes: attributes => ({
    email: attributes.email,
    emailVerified: attributes.emailVerified,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      emailVerified: boolean;
    };
  }
}

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return { user: null, session: null };
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return { user, session };
});

export const createUserSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {
    expiresIn: 30 * 24 * 60 * 60,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export const generateVerificationCode = async (userId: string) => {
  await db
    .delete(emailVerification)
    .where(eq(emailVerification.userId, userId));
  const code = generateRandomString(8, alphabet('0-9'));
  await db.insert(emailVerification).values({
    userId,
    code,
    expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes
  });
  return code;
};
