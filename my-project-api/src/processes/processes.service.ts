import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProcessesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.process.findMany({
      orderBy: {
        processName: 'asc',
      },
    });
  }
}
