import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { WorkerJwtGuard } from './worker-jwt.guard';
import { WorkerRequisitionApprovalService } from './worker-requisition-approval.service';
import { UpdateRequisitionApprovalDto } from './requisition-approval/dto/update-requisition-approval.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roleId: string;
  };
}

@Controller('requisition-approval')
@UseGuards(WorkerJwtGuard)
export class WorkerRequisitionApprovalController {
  constructor(
    @Inject(WorkerRequisitionApprovalService)
    private readonly approvalService: WorkerRequisitionApprovalService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRequisitionApprovalDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.approvalService.update(id, dto, req.user.roleId);
  }
}
