import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}