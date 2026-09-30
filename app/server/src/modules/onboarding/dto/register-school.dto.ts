import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterSchoolDto {
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsString()
  @IsNotEmpty()
  executiveName: string;

  @IsEmail()
  @IsNotEmpty()
  executiveEmail: string;
}
