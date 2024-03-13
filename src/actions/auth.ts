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
import { user, type User } from '@/db/schema';
import { lucia } from '@/lib/auth';

const createUserSession = async (userId: User['id']) => {
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
