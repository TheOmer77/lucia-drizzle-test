'use server';

import { eq } from 'drizzle-orm';

import { verifyFormSchema } from '@/schemas/auth';
import { db } from '@/db';
import { emailVerification, user, type User } from '@/db/schema';
import {
  createUserSession,
  createVerificationCode,
  lucia,
  sendVerificationEmail,
  validateRequest,
  verifyVerificationCode,
} from '@/lib/auth';

export const verifyEmailVerification = async (
  code: string
): Promise<{ success: true } | { success: false; error: string }> => {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) return { success: false, error: 'Unauthorized' };

  verifyFormSchema.parse({ code });

  const isValidCode = await verifyVerificationCode(currentUser.id, code);
  if (!isValidCode)
    return { success: false, error: 'Code is invalid or expired.' };

  await lucia.invalidateUserSessions(currentUser.id);
  await db
    .update(user)
    .set({ emailVerified: true })
    .where(eq(user.id, currentUser.id));
  await createUserSession(currentUser.id);
  return { success: true };
};

export const resendEmailVerification = async (): Promise<
  { success: true } | { success: false; error: string }
> => {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) return { success: false, error: 'Unauthorized' };
  if (currentUser.emailVerified)
    return { success: false, error: 'Email already verified.' };

  const [currentCode] = await db
    .select()
    .from(emailVerification)
    .where(eq(emailVerification.userId, currentUser.id));
  if (!currentCode)
    return { success: false, error: 'No verification code to resend.' };

  const msSinceUpdated = new Date().valueOf() - currentCode.updatedAt.valueOf(),
    secsSinceUpdated = Math.floor(msSinceUpdated / 1000);
  if (msSinceUpdated < 60000)
    return {
      success: false,
      error: `Please wait ${60 - secsSinceUpdated} ${
        60 - secsSinceUpdated === 1 ? 'second' : 'seconds'
      } before resending code.`,
    };

  const newCode = await createVerificationCode(currentUser.id, true);
  await sendVerificationEmail(currentUser.email, newCode);

  return { success: true };
};
