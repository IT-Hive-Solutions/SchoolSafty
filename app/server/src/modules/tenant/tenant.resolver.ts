import { Query, Resolver } from '@nestjs/graphql';
import { Tenant } from '../../database/entities/global/tenant.entity.js';
import { TenantService } from './tenant.service.js';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant])
  async schools() {
    return this.tenantService.getAllTenants();
  }
}
