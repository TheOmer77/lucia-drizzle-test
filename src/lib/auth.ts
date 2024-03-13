import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { db } from '@/db';
import { session, user } from '@/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    /** This sets cookies with super long expiration, since Next.js doesn't
     * allow Lucia to extend cookie expiration when rendering pages */
    expires: false,
    attributes: { secure: process.env.NODE_ENV === 'production' },
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
