import { Test, TestingModule } from '@nestjs/testing';
import { TestingReasonsController } from './testing-reasons.controller';

describe('TestingReasonsController', () => {
  let controller: TestingReasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestingReasonsController],
    }).compile();

    controller = module.get<TestingReasonsController>(TestingReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
