import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  executiveName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  executiveEmail: string;
}
