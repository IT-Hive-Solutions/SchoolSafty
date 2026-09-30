import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OnboardingService } from './onboarding.service.js';
import { RegisterSchoolDto } from './dto/register-school.dto.js';

@Controller('api/v1/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('register')
  async register(@Body() dto: RegisterSchoolDto) {
    return this.onboardingService.register(dto);
  }

  // In a real app, this should be protected by SuperAdmin guards
  @Get('requests')
  async getRequests() {
    return this.onboardingService.getPendingRequests();
  }

  // In a real app, this should be protected by SuperAdmin guards
  @Post('requests/:id/approve')
  async approveRequest(@Param('id') id: string) {
    return this.onboardingService.approveRequest(id);
  }

  // In a real app, this should be protected by SuperAdmin guards
  @Post('requests/:id/reject')
  async rejectRequest(@Param('id') id: string) {
    return this.onboardingService.rejectRequest(id);
  }
}
