import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'employee']);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name'),
  phone: varchar('phone').notNull(),
  email: varchar('email').notNull(),
  role: userRoleEnum('role').notNull().default('employee'),
  password: varchar('password').notNull(),
});
