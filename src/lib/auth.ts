import { cache } from 'react';
import { cookies } from 'next/headers';
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { eq } from 'drizzle-orm';
import { render } from '@react-email/render';

import { db } from '@/db';
import { emailVerification, session, user } from '@/db/schema';
import { sendEmail } from './email';
import VerifyEmail from '@/emails/verify';

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

export const createVerificationCode = async (
  userId: string,
  isResend = false
) => {
  const code = generateRandomString(8, alphabet('0-9')),
    expiresAt = createDate(new TimeSpan(15, 'm'));
  if (isResend) {
    await db
      .update(emailVerification)
      .set({ code, expiresAt, updatedAt: new Date() })
      .where(eq(emailVerification.userId, userId));
    return code;
  }
  await db
    .delete(emailVerification)
    .where(eq(emailVerification.userId, userId));
  await db.insert(emailVerification).values({ userId, code, expiresAt });
  return code;
};

export const verifyVerificationCode = async (userId: string, code: string) =>
  await db.transaction(async tx => {
    const [dbCode] = await tx
      .select()
      .from(emailVerification)
      .where(eq(emailVerification.userId, userId));

    if (!dbCode || dbCode.code !== code) return false;
    await tx
      .delete(emailVerification)
      .where(eq(emailVerification.id, dbCode.id));

    if (!isWithinExpirationDate(dbCode.expiresAt)) return false;
    return true;
  });

export const sendVerificationEmail = async (email: string, code: string) =>
  await sendEmail({
    to: email,
    subject: 'Verify your account',
    html: render(VerifyEmail({ email, code })),
  });
