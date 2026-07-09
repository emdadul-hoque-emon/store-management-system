import { relations } from 'drizzle-orm';
import { varchar } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { products } from '../product/product.schema';
import { numeric } from 'drizzle-orm/pg-core';

export const units = pgTable('units', {
  id: uuid().defaultRandom().primaryKey(),

  name: varchar({ length: 50 }).notNull(),

  shortName: varchar({ length: 20 }).notNull(),

  baseUnit: varchar({ length: 50 }).notNull(),

  conversionFactor: numeric({ precision: 12, scale: 2 }).$type<number>(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const unitRelation = relations(units, ({ one }) => ({
  products: one(products, {
    fields: [units.id],
    references: [products.unitId],
  }),
}));
