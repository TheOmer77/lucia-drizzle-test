import { cache } from 'react';
import { cookies } from 'next/headers';
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { db } from '@/db';
import { session, user } from '@/db/schema';
import { env } from '@/config/env';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    /** This sets cookies with super long expiration, since Next.js doesn't
     * allow Lucia to extend cookie expiration when rendering pages */
    expires: false,
    attributes: { secure: env.NODE_ENV === 'production' },
  },
  getUserAttributes: attributes => ({
    email: attributes.email,
    emailVerified: attributes.emailVerified,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      emailVerified: boolean;
    };
  }
}

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return { user: null, session: null };
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return { user, session };
});
