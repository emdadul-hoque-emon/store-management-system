import { bigint, bigserial, integer } from 'drizzle-orm/pg-core';
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
import { store } from '../store/store.schema';

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'paid',
  'partial',
  'due',
]);
export const invoiceTypeEnum = pgEnum('invoice_type', ['manual', 'image']);

export const invoices = pgTable('invoices', {
  id: uuid().defaultRandom().primaryKey(),

  storeId: uuid().notNull(),
  invoiceNo: integer().notNull(),

  customerName: varchar({ length: 150 }).notNull(),
  customerPhone: varchar({ length: 20 }).notNull(),

  subtotal: numeric({ precision: 12, scale: 2 }).default('0'),

  discount: numeric({ precision: 12, scale: 2 }).default('0'),

  total: numeric({ precision: 12, scale: 2 }).notNull(),

  paid: numeric({ precision: 12, scale: 2 }).default('0'),

  due: numeric({ precision: 12, scale: 2 }).default('0'),

  status: invoiceStatusEnum().default('due'),

  type: invoiceTypeEnum().default('manual'),

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

export const invoicesRelations = relations(invoices, ({ many, one }) => ({
  items: many(invoiceItems),
  store: one(store, {
    fields: [invoices.storeId],
    references: [store.id],
  }),
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
