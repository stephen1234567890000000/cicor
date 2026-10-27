import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class WorkerMasterDataService {
  constructor(
    @Inject('WORKER_PRISMA')
    private readonly prismaFactory: {
      create: () => PrismaClient;
    },
  ) {}

  async findProcesses() {
    const prisma = this.prismaFactory.create();

    try {
      return await prisma.process.findMany({
        orderBy: {
          processName: 'asc',
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async findCustomers() {
    const prisma = this.prismaFactory.create();

    try {
      return await prisma.customer.findMany({
        orderBy: {
          customerName: 'asc',
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async findTestingReasons() {
    const prisma = this.prismaFactory.create();

    try {
      return await prisma.testingReason.findMany({
        orderBy: {
          reason: 'asc',
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async findProducts(processId?: string, customerId?: string) {
    const prisma = this.prismaFactory.create();

    try {
      return await prisma.product.findMany({
        where: {
          ...(processId && { processId }),
          ...(customerId && {
            customerProducts: {
              some: {
                customerId,
              },
            },
          }),
        },
        include: {
          process: true,
        },
        orderBy: {
          productName: 'asc',
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
