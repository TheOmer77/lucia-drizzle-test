import { cookies } from 'next/headers';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { eq } from 'drizzle-orm';
import { render } from '@react-email/render';

import { lucia } from './lucia';
import { sendEmail } from '../email';
import { db } from '@/db';
import { emailVerification } from '@/db/schema';
import VerifyEmail from '@/emails/verify';

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
  const code = generateRandomString(6, alphabet('0-9')),
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
