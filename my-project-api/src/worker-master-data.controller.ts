import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { WorkerMasterDataService } from './worker-master-data.service';
import { WorkerJwtGuard } from './worker-jwt.guard';

@Controller()
export class WorkerMasterDataController {
  constructor(
    @Inject(WorkerMasterDataService)
    private readonly masterDataService: WorkerMasterDataService,
  ) {}

  @Get('processes')
  @UseGuards(WorkerJwtGuard)
  findProcesses() {
    return this.masterDataService.findProcesses();
  }

  @Get('customers')
  @UseGuards(WorkerJwtGuard)
  findCustomers() {
    return this.masterDataService.findCustomers();
  }

  @Get('testing-reasons')
  @UseGuards(WorkerJwtGuard)
  findTestingReasons() {
    return this.masterDataService.findTestingReasons();
  }

  @Get('products')
  @UseGuards(WorkerJwtGuard)
  findProducts(
    @Query('processId') processId?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.masterDataService.findProducts(processId, customerId);
  }
}
