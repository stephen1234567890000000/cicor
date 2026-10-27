import { Test, TestingModule } from '@nestjs/testing';
import { TestingRequisitionsController } from './testing-requisitions.controller';

describe('TestingRequisitionsController', () => {
  let controller: TestingRequisitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestingRequisitionsController],
    }).compile();

    controller = module.get<TestingRequisitionsController>(TestingRequisitionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
