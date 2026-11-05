import { Test, TestingModule } from '@nestjs/testing';
import { RequisitionApprovalController } from './requisition-approval.controller';

describe('RequisitionApprovalController', () => {
  let controller: RequisitionApprovalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitionApprovalController],
    }).compile();

    controller = module.get<RequisitionApprovalController>(RequisitionApprovalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
