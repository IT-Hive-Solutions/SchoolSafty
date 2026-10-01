import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tenant } from '../modules/tenant/entities/tenant.entity.js';
import { SuperAdmin } from '../modules/auth/entities/super-admin.entity.js';

// This is the primary configuration for the global schema connection
export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'schoolsafety',
  entities: [Tenant, SuperAdmin],
  synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production!
});
