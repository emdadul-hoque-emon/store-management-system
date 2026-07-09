import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { store } from '../store/store.schema';

export const userRoleEnum = pgEnum('user_role', ['admin', 'employee']);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('storeId').notNull(),
  name: varchar('name'),
  phone: varchar('phone').notNull(),
  email: varchar('email').notNull(),
  role: userRoleEnum('role').notNull().default('employee'),
  password: varchar('password').notNull(),
});

export const userRelation = relations(user, ({ one }) => ({
  store: one(store, {
    fields: [user.storeId],
    references: [store.id],
  }),
}));
