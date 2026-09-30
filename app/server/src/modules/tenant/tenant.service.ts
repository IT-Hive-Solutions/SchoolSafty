import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../database/entities/global/tenant.entity.js';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepo.find({
      order: { name: 'ASC' },
      select: { id: true, name: true }, // Only select id and name for the public dropdown
    });
  }
}
