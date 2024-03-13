import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;
