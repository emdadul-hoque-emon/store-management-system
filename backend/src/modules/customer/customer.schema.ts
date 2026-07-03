import { pgTable, timestamp, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const customer = pgTable('customers', {
  id: uuid().defaultRandom().primaryKey(),

  name: varchar({ length: 150 }).notNull(),

  phone: varchar({ length: 20 }).unique(),

  email: varchar({ length: 255 }),

  address: text(),

  note: text(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
