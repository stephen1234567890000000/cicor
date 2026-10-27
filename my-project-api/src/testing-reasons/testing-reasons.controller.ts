import { Controller, UseGuards, Get } from '@nestjs/common';
import { TestingReasonsService } from './testing-reasons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('testing-reasons')
export class TestingReasonsController {
  constructor(private readonly testingReasonsService: TestingReasonsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.testingReasonsService.findAll();
  }
}
