import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { OnboardingController } from './onboarding.controller.js';
import { OnboardingService } from './onboarding.service.js';
import { OnboardingResolver } from './onboarding.resolver.js';
import { RegistrationRequest } from '../../database/entities/global/registration-request.entity.js';
import { Tenant } from '../../database/entities/global/tenant.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationRequest, Tenant])],
  // controllers: [OnboardingController], // Keeping it commented out as we transition to GraphQL
  providers: [OnboardingService, OnboardingResolver],
})
export class OnboardingModule {}
