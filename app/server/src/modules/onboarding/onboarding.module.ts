import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { OnboardingController } from './onboarding.controller.js';
import { OnboardingService } from './onboarding.service.js';
import { OnboardingResolver } from './onboarding.resolver.js';
import { Tenant } from '../tenant/entities/tenant.entity.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), MailModule],
  // controllers: [OnboardingController], // Keeping it commented out as we transition to GraphQL
  providers: [OnboardingService, OnboardingResolver],
})
export class OnboardingModule {}
