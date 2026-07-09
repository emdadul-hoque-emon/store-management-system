import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { products } from '../product/product.schema';
import { user } from '../user/user.schema';
import { invoices } from '../invoice/invoice.schema';

export const store = pgTable('stores', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  address: varchar({ length: 255 }),
  email: varchar({ length: 100 }).notNull(),
  phone: varchar({ length: 20 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const storeRelation = relations(store, ({ one, many }) => ({
  products: one(products, {
    fields: [store.id],
    references: [products.storeId],
  }),
  users: many(user),
  invoices: many(invoices),
}));
