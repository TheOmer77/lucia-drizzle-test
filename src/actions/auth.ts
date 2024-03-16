'use server';

import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { eq, sql } from 'drizzle-orm';

import {
  loginFormSchema,
  signupFormSchema,
  verifyFormSchema,
  type LoginFormValues,
  type SignupFormValues,
} from '@/schemas/auth';
import { db } from '@/db';
import { emailVerification, user, type User } from '@/db/schema';
import {
  createUserSession,
  createVerificationCode,
  lucia,
  validateRequest,
  verifyVerificationCode,
} from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export const loginUser = async (
  values: LoginFormValues
): Promise<
  | { success: true; data: Pick<User, 'emailVerified'> }
  | { success: false; error: string }
> => {
  loginFormSchema.parse(values);

  const [existingUser] = await db
    .select({
      id: user.id,
      password: user.password,
      emailVerified: user.emailVerified,
    })
    .from(user)
    .where(eq(user.email, values.email))
    .limit(1);

  if (!existingUser || !existingUser.password)
    return { success: false, error: 'Incorrect email or password.' };
  const isValidPassword = await new Argon2id().verify(
    existingUser.password,
    values.password
  );
  if (!isValidPassword)
    return { success: false, error: 'Incorrect email or password.' };

  await createUserSession(existingUser.id);
  return { success: true, data: { emailVerified: existingUser.emailVerified } };
};

export const registerUser = async (
  values: SignupFormValues
): Promise<{ success: true } | { success: false; error: string }> => {
  signupFormSchema.parse(values);
  const { email, password } = values;

  const userExists = (
    await db
      .select({ value: sql<boolean>`COUNT(1) > 0` })
      .from(user)
      .where(eq(user.email, email))
  )[0]?.value;
  if (userExists)
    return { success: false, error: 'A user with this email already exists.' };

  const hashedPassword = await new Argon2id().hash(password);

  try {
    const [newUser] = await db
      .insert(user)
      .values({ email, password: hashedPassword })
      .returning({ id: user.id });

    const verificationCode = await createVerificationCode(newUser.id);
    await sendEmail({
      to: email,
      subject: 'Verify your account',
      html: `<h1>Verify your account</h1>
<p>Use code <b>${verificationCode}</b> as the verification code for ${email}.`,
    });

    await createUserSession(newUser.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : // TEMPORARY!
            'Something went wrong while trying to create your new user.',
    };
  }
};

export const verifyUser = async (
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

export const resendVerificationCode = async (): Promise<
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
  await sendEmail({
    to: currentUser.email,
    subject: 'Verify your account',
    html: `<h1>Verify your account</h1>
<p>Use code <b>${newCode}</b> as the verification code for ${currentUser.email}.`,
  });
  return { success: true };
};

export const logoutUser = async (): Promise<
  { success: true } | { success: false; error: string }
> => {
  const { session } = await validateRequest();
  if (!session) return { success: false, error: 'Unauthorized' };

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return { success: true };
};
