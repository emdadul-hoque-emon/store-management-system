import { varchar } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const category = pgTable('categories', {
  id: uuid().defaultRandom().primaryKey(),

  name: varchar({ length: 100 }).notNull().unique(),

  description: text(),

  isActive: boolean().default(true).notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
