import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Tenant } from '../tenant/entities/tenant.entity.js';
import { CreateOrganizationInput } from './dto/create-organization.input.js';
import { CreateOrganizationResponse } from './dto/create-organization.response.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  // Generate a random secure password
  private generateSecurePassword(length = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  async createOrganization(input: CreateOrganizationInput): Promise<CreateOrganizationResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create Tenant record
      const safeOrgName = input.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const schemaName = `tenant_${safeOrgName}_${Date.now()}`;
      
      const tenant = queryRunner.manager.create(Tenant, {
        name: input.organizationName,
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
          "role" character varying NOT NULL DEFAULT 'USER',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_${schemaName}_email" UNIQUE ("email"),
          CONSTRAINT "PK_${schemaName}_id" PRIMARY KEY ("id")
        )
      `);

      // Generate a secure password and hash it
      const rawPassword = this.generateSecurePassword(12);
      const passwordHash = rawPassword; // TEMPORARY: Storing as plain text

      // Seed the initial TENANT_ADMIN
      await queryRunner.query(`
        INSERT INTO "${schemaName}"."users" ("email", "name", "passwordHash", "role")
        VALUES ($1, $2, $3, 'TENANT_ADMIN')
      `, [input.executiveEmail, input.executiveName, passwordHash]);

      this.logger.log(`\n========================================================\n[Provisioning] Created TENANT_ADMIN for ${tenant.name}.\nEmail: ${input.executiveEmail}\nPassword: ${rawPassword}\n========================================================\n`);

      await queryRunner.commitTransaction();

      // Send the welcome email
      await this.mailService.sendOrganizationWelcomeEmail(
        input.executiveEmail,
        input.executiveName,
        tenant.name,
        rawPassword
      );
      
      return {
        tenant,
        initialPassword: rawPassword
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
