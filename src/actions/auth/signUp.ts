'use server';

import { eq, sql } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

import { db } from '@/db';
import { user } from '@/db/schema';
import { signUpFormSchema, type SignUpFormValues } from '@/schemas/auth';
import {
  createUserSession,
  createVerificationCode,
  sendVerificationEmail,
} from '@/lib/auth/utils';

export const signUp = async (
  values: SignUpFormValues
): Promise<{ success: true } | { success: false; error: string }> => {
  signUpFormSchema.parse(values);
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
    await sendVerificationEmail(email, verificationCode);

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
