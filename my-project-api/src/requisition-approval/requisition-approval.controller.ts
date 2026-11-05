import {
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  Body,
  Req,
} from '@nestjs/common';
import { RequisitionApprovalService } from './requisition-approval.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateRequisitionApprovalDto } from './dto/update-requisition-approval.dto';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roleId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('requisition-approval')
export class RequisitionApprovalController {
  constructor(
    private readonly RequisitionApprovalService: RequisitionApprovalService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.RequisitionApprovalService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRequisitionApprovalDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.RequisitionApprovalService.update(id, dto, req.user.roleId);
  }
}
