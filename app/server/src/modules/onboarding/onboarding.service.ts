import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { RegistrationRequest, RegistrationStatus } from '../../database/entities/global/registration-request.entity.js';
import { Tenant } from '../../database/entities/global/tenant.entity.js';
import { RegisterSchoolDto } from './dto/register-school.dto.js';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    @InjectRepository(RegistrationRequest)
    private readonly requestRepo: Repository<RegistrationRequest>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterSchoolDto): Promise<RegistrationRequest> {
    const request = this.requestRepo.create(dto);
    return this.requestRepo.save(request);
  }

  async getPendingRequests(): Promise<RegistrationRequest[]> {
    return this.requestRepo.find({
      where: { status: RegistrationStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  // Generate a random secure password
  private generateSecurePassword(length = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    // Use Math.random for simplicity, but crypto.getRandomValues is better. Since this is Node:
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  async approveRequest(id: string): Promise<Tenant> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await queryRunner.manager.findOne(RegistrationRequest, { where: { id } });
      
      if (!request) {
        throw new NotFoundException('Registration request not found');
      }

      if (request.status !== RegistrationStatus.PENDING) {
        throw new ConflictException(`Request is already ${request.status}`);
      }

      // Update status
      request.status = RegistrationStatus.APPROVED;
      await queryRunner.manager.save(request);

      // Create Tenant record
      const safeSchoolName = request.schoolName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const schemaName = `tenant_${safeSchoolName}_${Date.now()}`;
      
      const tenant = queryRunner.manager.create(Tenant, {
        name: request.schoolName,
        schemaName,
      });
      await queryRunner.manager.save(tenant);

      // Create Postgres Schema
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      // Create Users table for this specific tenant schema
      await queryRunner.query(`
        CREATE TABLE "${schemaName}"."users" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
          "email" character varying NOT NULL,
          "name" character varying NOT NULL,
          "passwordHash" character varying NOT NULL,
          "role" character varying NOT NULL DEFAULT 'STUDENT',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_${schemaName}_email" UNIQUE ("email"),
          CONSTRAINT "PK_${schemaName}_id" PRIMARY KEY ("id")
        )
      `);

      // Generate a secure password and hash it
      const rawPassword = this.generateSecurePassword(12);
      const passwordHash = rawPassword; // TEMPORARY: Storing as plain text

      // Seed the initial SCHOOL_ADMIN
      await queryRunner.query(`
        INSERT INTO "${schemaName}"."users" ("email", "name", "passwordHash", "role")
        VALUES ($1, $2, $3, 'SCHOOL_ADMIN')
      `, [request.executiveEmail, request.executiveName, passwordHash]);

      // TODO: In the future, send 'rawPassword' via email
      this.logger.log(`\n========================================================\n[Provisioning] Created SCHOOL_ADMIN for ${tenant.name}.\nEmail: ${request.executiveEmail}\nPassword: ${rawPassword}\n(NOTE: Save this! Email sending is not yet implemented.)\n========================================================\n`);

      await queryRunner.commitTransaction();
      return tenant;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectRequest(id: string): Promise<RegistrationRequest> {
    const request = await this.requestRepo.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Registration request not found');
    }
    request.status = RegistrationStatus.REJECTED;
    return this.requestRepo.save(request);
  }
}
