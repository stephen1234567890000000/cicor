import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestingReasonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.testingReason.findMany({
      orderBy: {
        reason: 'asc',
      },
    });
  }
}
