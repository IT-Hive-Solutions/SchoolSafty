import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RegisterSchoolInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  executiveName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  executiveEmail: string;
}
