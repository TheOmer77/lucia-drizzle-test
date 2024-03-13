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
import { lucia } from '@/lib/auth';

export const loginUser = async (values: LoginFormValues) => {
  loginFormSchema.parse(values);

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.username, values.username))
    .limit(1);

  if (!existingUser || !existingUser.password)
    return {
      success: false,
      error: 'Incorrect username or password.',
    } satisfies { success: false; error: string };
  const isValidPassword = await new Argon2id().verify(
    existingUser.password,
    values.password
  );
  if (!isValidPassword)
    return {
      success: false,
      error: 'Incorrect username or password.',
    } satisfies { success: false; error: string };

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 30 * 24 * 60 * 60,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: true,
    data: { id: existingUser.id, username: existingUser.username },
  } satisfies {
    success: true;
    data: { id: string; username: string };
  };
};

export const registerUser = async (values: SignupFormValues) => {
  signupFormSchema.parse(values);
  const { username, password } = values;

  const hashedPassword = await new Argon2id().hash(password);

  try {
    const [newUser] = await db
      .insert(user)
      .values({ username, password: hashedPassword })
      .returning({ id: user.id, username: user.username });

    const session = await lucia.createSession(newUser.id, {
      expiresIn: 30 * 24 * 60 * 60,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true, data: newUser } satisfies {
      success: true;
      data: typeof newUser;
    };
  } catch (error) {
    return { success: false, error } satisfies {
      success: false;
      error: typeof error;
    };
  }
};
