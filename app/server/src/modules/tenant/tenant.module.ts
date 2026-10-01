import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity.js';
import { TenantResolver } from './tenant.resolver.js';
import { TenantService } from './tenant.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantResolver],
  exports: [TenantService],
})
export class TenantModule {}
