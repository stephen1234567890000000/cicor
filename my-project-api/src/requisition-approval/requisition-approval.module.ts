import { Module } from '@nestjs/common';
import { RequisitionApprovalController } from './requisition-approval.controller';
import { RequisitionApprovalService } from './requisition-approval.service';

@Module({
  controllers: [RequisitionApprovalController],
  providers: [RequisitionApprovalService]
})
export class RequisitionApprovalModule {}
