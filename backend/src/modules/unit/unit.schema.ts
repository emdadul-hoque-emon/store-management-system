import { varchar } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const units = pgTable('units', {
  id: uuid().defaultRandom().primaryKey(),

  name: varchar({ length: 50 }).notNull(),

  shortName: varchar({ length: 20 }).notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
