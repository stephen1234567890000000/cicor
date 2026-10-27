import { Module } from '@nestjs/common';
import { TestingReasonsController } from './testing-reasons.controller';
import { TestingReasonsService } from './testing-reasons.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestingReasonsController],
  providers: [TestingReasonsService]
})
export class TestingReasonsModule {}
