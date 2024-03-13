'use server';

import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';

import {
  loginFormSchema,
  signupFormSchema,
  type LoginFormValues,
  type SignupFormValues,
} from '@/schemas/auth';
import { db } from '@/db';
import { user, type User } from '@/db/schema';
import { createUserSession, lucia, validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

export const loginUser = async (
  values: LoginFormValues
): Promise<
  | { success: true; data: Pick<User, 'id' | 'username'> }
  | { success: false; error: string }
> => {
  loginFormSchema.parse(values);

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.username, values.username))
    .limit(1);

  if (!existingUser || !existingUser.password)
    return { success: false, error: 'Incorrect username or password.' };
  const isValidPassword = await new Argon2id().verify(
    existingUser.password,
    values.password
  );
  if (!isValidPassword)
    return { success: false, error: 'Incorrect username or password.' };

  await createUserSession(existingUser.id);
  return {
    success: true,
    data: { id: existingUser.id, username: existingUser.username },
  };
};

export const registerUser = async (
  values: SignupFormValues
): Promise<
  | { success: true; data: Pick<User, 'id' | 'username'> }
  | { success: false; error: unknown }
> => {
  signupFormSchema.parse(values);
  const { username, password } = values;

  const hashedPassword = await new Argon2id().hash(password);

  try {
    const [newUser] = await db
      .insert(user)
      .values({ username, password: hashedPassword })
      .returning({ id: user.id, username: user.username });

    await createUserSession(newUser.id);
    return { success: true, data: newUser };
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
