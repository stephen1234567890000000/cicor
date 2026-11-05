import { Test, TestingModule } from '@nestjs/testing';
import { RequisitionApprovalService } from './requisition-approval.service';

describe('RequisitionApprovalService', () => {
  let service: RequisitionApprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequisitionApprovalService],
    }).compile();

    service = module.get<RequisitionApprovalService>(RequisitionApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
