import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

import { user } from './user';

export const emailVerification = pgTable('email_verification', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

export type EmailVerification = InferSelectModel<typeof emailVerification>;
