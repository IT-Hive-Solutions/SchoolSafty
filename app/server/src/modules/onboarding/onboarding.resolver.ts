import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegistrationRequest } from '../../database/entities/global/registration-request.entity.js';
import { Tenant } from '../../database/entities/global/tenant.entity.js';
import { RegisterSchoolInput } from './dto/register-school.input.js';
import { OnboardingService } from './onboarding.service.js';

@Resolver()
export class OnboardingResolver {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Mutation(() => RegistrationRequest)
  async registerSchool(@Args('input') input: RegisterSchoolInput) {
    return this.onboardingService.register(input);
  }

  // Admin query
  @Query(() => [RegistrationRequest])
  async pendingRequests() {
    return this.onboardingService.getPendingRequests();
  }

  // Admin mutations
  @Mutation(() => Tenant)
  async approveRequest(@Args('id') id: string) {
    return this.onboardingService.approveRequest(id);
  }

  @Mutation(() => RegistrationRequest)
  async rejectRequest(@Args('id') id: string) {
    return this.onboardingService.rejectRequest(id);
  }
}
