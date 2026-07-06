import { integer } from 'drizzle-orm/pg-core';
import {
  pgTable,
  uuid,
  numeric,
  timestamp,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { products } from '../product/product.schema';
import { relations } from 'drizzle-orm';

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'paid',
  'partial',
  'due',
]);

export const invoices = pgTable('invoices', {
  id: uuid().defaultRandom().primaryKey(),

  invoiceNo: varchar({ length: 50 }).notNull().unique(),

  customerName: varchar({ length: 150 }).notNull(),

  subtotal: numeric({ precision: 12, scale: 2 }).default('0'),

  discount: numeric({ precision: 12, scale: 2 }).default('0'),

  total: numeric({ precision: 12, scale: 2 }).notNull(),

  paid: numeric({ precision: 12, scale: 2 }).default('0'),

  due: numeric({ precision: 12, scale: 2 }).default('0'),

  status: invoiceStatusEnum().default('due'),

  imageUrl: varchar({ length: 500 }), // optional uploaded bill image

  note: varchar({ length: 255 }),

  createdAt: timestamp().defaultNow().notNull(),
});

export const invoiceItems = pgTable('invoice_items', {
  id: uuid().defaultRandom().primaryKey(),

  invoiceId: uuid()
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),

  productId: uuid()
    .notNull()
    .references(() => products.id),

  quantity: integer().notNull(),

  price: numeric({ precision: 12, scale: 2 }).notNull(),

  total: numeric({ precision: 12, scale: 2 }).notNull(),
});

export const invoicesRelations = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),

  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}));
