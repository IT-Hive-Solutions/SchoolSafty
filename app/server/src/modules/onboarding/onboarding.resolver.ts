import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateOrganizationInput } from './dto/create-organization.input.js';
import { CreateOrganizationResponse } from './dto/create-organization.response.js';
import { OnboardingService } from './onboarding.service.js';

@Resolver()
export class OnboardingResolver {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Mutation(() => CreateOrganizationResponse)
  async createOrganization(@Args('input') input: CreateOrganizationInput) {
    return this.onboardingService.createOrganization(input);
  }
}
