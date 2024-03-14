'use server';

import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';

import {
  loginFormSchema,
  signupFormSchema,
  type LoginFormValues,
  type SignupFormValues,
} from '@/schemas/auth';
import { db } from '@/db';
import { user } from '@/db/schema';
import {
  createUserSession,
  generateVerificationCode,
  lucia,
  validateRequest,
} from '@/lib/auth';

export const loginUser = async (
  values: LoginFormValues
): Promise<{ success: true } | { success: false; error: string }> => {
  loginFormSchema.parse(values);

  const [existingUser] = await db
    .select()
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
  return { success: true };
};

export const registerUser = async (
  values: SignupFormValues
): Promise<{ success: true } | { success: false; error: unknown }> => {
  signupFormSchema.parse(values);
  const { email, password } = values;

  const hashedPassword = await new Argon2id().hash(password);

  try {
    const [newUser] = await db
      .insert(user)
      .values({ email, password: hashedPassword })
      .returning({ id: user.id });

    const verificationCode = await generateVerificationCode(newUser.id);
    // TODO: Send verification code by email
    console.log(
      `TEMPORARY LOG: Use code '${verificationCode}' as the verification code for ${values.email}.`
    );

    await createUserSession(newUser.id);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
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
