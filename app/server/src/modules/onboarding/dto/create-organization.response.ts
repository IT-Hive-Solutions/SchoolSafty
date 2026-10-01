import { Field, ObjectType } from '@nestjs/graphql';
import { Tenant } from '../../tenant/entities/tenant.entity.js';

@ObjectType()
export class CreateOrganizationResponse {
  @Field(() => Tenant)
  tenant: Tenant;

  @Field()
  initialPassword: string;
}
