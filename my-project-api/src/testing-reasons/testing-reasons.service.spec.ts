import { Test, TestingModule } from '@nestjs/testing';
import { TestingReasonsService } from './testing-reasons.service';

describe('TestingReasonsService', () => {
  let service: TestingReasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestingReasonsService],
    }).compile();

    service = module.get<TestingReasonsService>(TestingReasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
