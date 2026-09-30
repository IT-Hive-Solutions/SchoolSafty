import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RegistrationRequest } from '../database/entities/global/registration-request.entity.js';
import { Tenant } from '../database/entities/global/tenant.entity.js';
import { SuperAdmin } from '../database/entities/global/super-admin.entity.js';

// This is the primary configuration for the global schema connection
export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'schoolsafety',
  entities: [RegistrationRequest, Tenant, SuperAdmin],
  synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production!
});
