import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user';

export const session = pgTable('session', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});