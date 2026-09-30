import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { LoginInput, TenantLoginInput, AuthResponse } from './dto/login.input.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async superAdminLogin(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthResponse)
  async tenantLogin(@Args('input') input: TenantLoginInput) {
    return this.authService.tenantLogin(input);
  }
}
