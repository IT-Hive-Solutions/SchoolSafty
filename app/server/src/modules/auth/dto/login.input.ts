import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class TenantLoginInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field({ nullable: true })
  superAdminId?: string;

  @Field({ nullable: true })
  userId?: string;
}
