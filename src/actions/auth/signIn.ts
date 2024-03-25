'use server';

import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { user, type User } from '@/db/schema';
import { signInFormSchema, type SignInFormValues } from '@/schemas/auth';
import { createUserSession } from '@/lib/auth';

export const signIn = async (
  values: SignInFormValues
): Promise<
  | { success: true; data: Pick<User, 'emailVerified'> }
  | { success: false; error: string }
> => {
  signInFormSchema.parse(values);

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
