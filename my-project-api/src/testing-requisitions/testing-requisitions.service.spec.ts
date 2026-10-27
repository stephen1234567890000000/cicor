import { Test, TestingModule } from '@nestjs/testing';
import { TestingRequisitionsService } from './testing-requisitions.service';

describe('TestingRequisitionsService', () => {
  let service: TestingRequisitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestingRequisitionsService],
    }).compile();

    service = module.get<TestingRequisitionsService>(TestingRequisitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
