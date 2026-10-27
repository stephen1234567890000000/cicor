import { Module } from '@nestjs/common';
import { TestingRequisitionsController } from './testing-requisitions.controller';
import { TestingRequisitionsService } from './testing-requisitions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestingRequisitionsController],
  providers: [TestingRequisitionsService],
})
export class TestingRequisitionsModule {}
