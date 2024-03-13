'use server';

import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';

import { signupFormSchema, type SignupFormValues } from '@/schemas/signup';
import { db } from '@/db';
import { user } from '@/db/schema';
import { lucia } from '@/lib/auth';

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
