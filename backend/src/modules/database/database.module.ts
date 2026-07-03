import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';

import { DATABASE_CONNECTION } from './constant';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as schema from './schema';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
        });

        const db = drizzle({
          client: pool,
          schema,
        });

        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
