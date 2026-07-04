import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { units } from '../unit/unit.schema';
import { unique } from 'drizzle-orm/pg-core';

export const products = pgTable(
  'products',
  {
    id: uuid().defaultRandom().primaryKey(),

    name: varchar({ length: 255 }).notNull(),

    barcode: varchar({ length: 50 }).notNull().unique(),

    unitId: uuid()
      .references(() => units.id)
      .notNull(),

    price: numeric({ precision: 12, scale: 2 })
      .$type<number>()
      .default(0)
      .notNull(),

    stock: integer().default(0).notNull(),

    imageUrl: varchar({ length: 500 }),

    isActive: boolean().default(true),

    createdAt: timestamp().defaultNow().notNull(),

    updatedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (product) => [
    unique('products_name_unit_unique').on(product.name, product.unitId),
  ],
);
