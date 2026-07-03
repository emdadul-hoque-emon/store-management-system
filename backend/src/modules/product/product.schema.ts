import { numeric, varchar } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { units } from '../unit/unit.schema';
import { category } from '../category/category.schema';

export const products = pgTable('products', {
  id: uuid().defaultRandom().primaryKey(),

  barcode: varchar({ length: 50 }),

  sku: varchar({ length: 50 }),

  name: varchar({ length: 255 }).notNull(),

  categoryId: uuid().references(() => category.id),

  // brandId: uuid().references(() => brands.id),

  unitId: uuid().references(() => units.id),

  purchasePrice: numeric({ precision: 12, scale: 2 }).notNull(),

  sellingPrice: numeric({ precision: 12, scale: 2 }).notNull(),

  stock: integer().default(0).notNull(),

  minimumStock: integer().default(0).notNull(),

  imageUrl: text(),

  description: text(),

  isActive: boolean().default(true).notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
