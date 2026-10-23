import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
} from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { WorkerAuthService } from './worker-auth.service';

class WorkerLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

@Controller('auth')
export class WorkerAuthController {
  constructor(
    @Inject(WorkerAuthService)
    private readonly workerAuthService: WorkerAuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: WorkerLoginDto) {
    return this.workerAuthService.login(dto);
  }
}
