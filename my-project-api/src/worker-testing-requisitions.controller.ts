import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkerJwtGuard } from './worker-jwt.guard';
import { WorkerTestingRequisitionsService } from './worker-testing-requisitions.service';
import { CreateTestingRequisitionDto } from './testing-requisitions/dto/testing-requisitions.dto';

@Controller('testing-requisitions')
@UseGuards(WorkerJwtGuard)
export class WorkerTestingRequisitionsController {
  constructor(
    @Inject(WorkerTestingRequisitionsService)
    private readonly testingRequisitionsService: WorkerTestingRequisitionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateTestingRequisitionDto) {
    return this.testingRequisitionsService.create(dto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    return this.testingRequisitionsService.findAll(page, limit);
  }
}
