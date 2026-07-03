import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  numeric,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from '../user/user.schema';
import { customer } from '../customer/customer.schema';

export const invoiceSourceEnum = pgEnum('invoice_source', ['manual', 'image']);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'paid',
  'partial',
  'due',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'card',
  'other',
]);

export const invoice = pgTable('invoices', {
  id: uuid().defaultRandom().primaryKey(),

  invoiceNo: varchar({ length: 30 }).notNull().unique(),

  customerId: uuid().references(() => customer.id),

  createdBy: uuid().references(() => user.id),

  source: invoiceSourceEnum().default('manual').notNull(),

  subtotal: numeric({ precision: 12, scale: 2 }).notNull(),

  discount: numeric({ precision: 12, scale: 2 }).default('0').notNull(),

  tax: numeric({ precision: 12, scale: 2 }).default('0').notNull(),

  total: numeric({ precision: 12, scale: 2 }).notNull(),

  paidAmount: numeric({ precision: 12, scale: 2 }).default('0').notNull(),

  dueAmount: numeric({ precision: 12, scale: 2 }).default('0').notNull(),

  status: invoiceStatusEnum().default('due').notNull(),

  paymentMethod: paymentMethodEnum(),

  imageUrl: text(),

  note: text(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
