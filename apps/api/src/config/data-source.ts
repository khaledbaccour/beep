import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

const baseOptions = {
  type: 'postgres' as const,
  entities: ['src/modules/**/domain/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
};

const connectionOptions = databaseUrl
  ? {
      url: databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'beep',
      password: process.env.POSTGRES_PASSWORD || 'changeme',
      database: process.env.POSTGRES_DB || 'beep',
    };

export default new DataSource({
  ...baseOptions,
  ...connectionOptions,
});
