import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTestingRequisitionDto } from './testing-requisitions/dto/testing-requisitions.dto';

@Injectable()
export class WorkerTestingRequisitionsService {
  constructor(
    @Inject('WORKER_PRISMA')
    private readonly prismaFactory: {
      create: () => PrismaClient;
    },
  ) {}

  async create(dto: CreateTestingRequisitionDto) {
    const prisma = this.prismaFactory.create();

    try {
      const customer = await prisma.customer.findUnique({
        where: { id: dto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer Not Found');
      }

      const product = await prisma.product.findUnique({
        where: { id: dto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product Not Found');
      }

      const testingReason = await prisma.testingReason.findUnique({
        where: { id: dto.testingReasonId },
      });

      if (!testingReason) {
        throw new NotFoundException('Testing Reason Not Found');
      }

      const customerProduct = await prisma.customerProduct.findUnique({
        where: {
          customerId_productId: {
            customerId: dto.customerId,
            productId: dto.productId,
          },
        },
      });

      if (!customerProduct) {
        throw new BadRequestException(
          'Product is not registered for this customer',
        );
      }

      return await prisma.$transaction(async (tx) => {
        const requiredRoles = ['Manager', 'Supervisor', 'Director'];

        const roles = await tx.role.findMany({
          where: {
            roleName: {
              in: requiredRoles,
            },
          },
          select: {
            id: true,
            roleName: true,
          },
        });

        const foundRoleNames = roles.map((role) => role.roleName);
        const missingRoles = requiredRoles.filter(
          (roleName) => !foundRoleNames.includes(roleName),
        );

        if (missingRoles.length > 0) {
          throw new BadRequestException(
            `Required roles not found: ${missingRoles.join(', ')}`,
          );
        }

        const counter = await tx.testingRequisitionCounter.upsert({
          where: { id: 1 },
          update: {
            nextNumber: { increment: 1 },
          },
          create: {
            id: 1,
            nextNumber: 0,
          },
        });

        const requisition = await tx.testingRequisition.create({
          data: {
            customerId: dto.customerId,
            productId: dto.productId,
            testingReasonId: dto.testingReasonId,
            revisionNo: counter.nextNumber,
            trialNo: counter.nextNumber,
            testDate: new Date(dto.testDate),
            mcName: dto.mcName,
            inspectionSample: dto.inspectionSample,
            toolroomSample: dto.toolroomSample,
            clientSample: dto.clientSample,
            backFlush: dto.backFlush,
            rawMaterial: dto.rawMaterial,
          },
        });

        await tx.requisitionApproval.createMany({
          data: roles.map((role) => ({
            testingRequisitionId: requisition.id,
            roleId: role.id,
            signature: null,
            signAt: null,
          })),
        });

        return tx.testingRequisition.findUnique({
          where: {
            id: requisition.id,
          },
          include: {
            customer: true,
            product: true,
            testingReason: true,
            approvals: {
              include: {
                role: {
                  select: {
                    roleName: true,
                  },
                },
              },
            },
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(page = 1, limit = 10) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and Limit should greater than 0');
    }

    if (limit > 100) {
      throw new BadRequestException('Limit max is 100');
    }

    const prisma = this.prismaFactory.create();

    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        prisma.testingRequisition.findMany({
          skip,
          take: limit,
          include: {
            customer: true,
            product: {
              include: {
                process: true,
              },
            },
            testingReason: true,
          },
          orderBy: {
            testDate: 'desc',
          },
        }),
        prisma.testingRequisition.count(),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  async findOne(id: string) {
    const prisma = this.prismaFactory.create();
    try {
      const requisition = await prisma.testingRequisition.findUnique({
        where: { id },
        include: {
          customer: true,
          product: {
            include: {
              process: true,
            },
          },
          testingReason: true,
          approvals: {
            include: {
              role: {
                select: {
                  roleName: true,
                },
              },
            },
          },
        },
      });

      if (!requisition) {
        throw new NotFoundException('Testing Requisition Not Found');
      }

      return requisition;
    } finally {
      await prisma.$disconnect();
    }
  }
}
