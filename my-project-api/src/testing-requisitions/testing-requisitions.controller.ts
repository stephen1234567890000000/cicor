import {
  Controller,
  Body,
  Post,
  UseGuards,
  Query,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TestingRequisitionsService } from './testing-requisitions.service';
import { CreateTestingRequisitionDto } from './dto/testing-requisitions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('testing-requisitions')
export class TestingRequisitionsController {
  constructor(
    private readonly testingRequisition: TestingRequisitionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTestingRequisitionDto) {
    return this.testingRequisition.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    return this.testingRequisition.findAll(page, limit);
  }
}
