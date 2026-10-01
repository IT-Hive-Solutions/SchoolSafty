import { Query, Resolver } from '@nestjs/graphql';
import { Tenant } from './entities/tenant.entity.js';
import { TenantService } from './tenant.service.js';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant])
  async organizations() {
    return this.tenantService.getAllTenants();
  }
}
