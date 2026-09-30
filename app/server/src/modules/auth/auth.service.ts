import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SuperAdmin } from '../../database/entities/global/super-admin.entity.js';
import { Tenant } from '../../database/entities/global/tenant.entity.js';
import { LoginInput, TenantLoginInput, AuthResponse } from './dto/login.input.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(SuperAdmin)
    private readonly superAdminRepo: Repository<SuperAdmin>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const existingAdmin = await this.superAdminRepo.findOne({ where: { email: 'admin@schoolsafety.com' } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      const admin = this.superAdminRepo.create({
        name: 'Default Admin',
        email: 'admin@schoolsafety.com',
        passwordHash,
      });
      await this.superAdminRepo.save(admin);
      console.log('Seeded default super admin: admin@schoolsafety.com / admin123');
    }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const admin = await this.superAdminRepo.findOne({ where: { email: input.email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    
    const isPasswordValid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: admin.id, role: 'SUPER_ADMIN' };
    const token = await this.jwtService.signAsync(payload);

    return { token, superAdminId: admin.id };
  }

  async tenantLogin(input: TenantLoginInput): Promise<AuthResponse> {
    // 1. Verify tenant exists
    const tenant = await this.dataSource.getRepository(Tenant).findOne({ where: { id: input.tenantId } });
    if (!tenant) throw new UnauthorizedException('School not found');

    // 2. Query user in tenant's schema
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      const result = await queryRunner.query(`
        SELECT id, email, "passwordHash", role 
        FROM "${tenant.schemaName}"."users" 
        WHERE email = $1
      `, [input.email]);

      if (!result || result.length === 0) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = result[0];

      // 3. Verify password
      const isPasswordValid = input.password === user.passwordHash; // TEMPORARY: plain text
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 4. Generate JWT with tenant context
      const payload = { 
        sub: user.id, 
        role: user.role,
        tenantId: tenant.id,
        schemaName: tenant.schemaName,
        schoolName: tenant.name, // Include name so the frontend can read it without a DB hit
      };
      
      const token = await this.jwtService.signAsync(payload);

      return { token, userId: user.id };
    } finally {
      await queryRunner.release();
    }
  }
}
