import { Controller, UseGuards, Get } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.processesService.findAll();
  }
}
