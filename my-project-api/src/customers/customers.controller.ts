import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.customersService.findAll();
  }
}
