import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateRequisitionApprovalDto } from './requisition-approval/dto/update-requisition-approval.dto';

@Injectable()
export class WorkerRequisitionApprovalService {
  constructor(
    @Inject('WORKER_PRISMA')
    private readonly prismaFactory: {
      create: () => PrismaClient;
    },
  ) {}

  async findOne(id: string) {
    const prisma = this.prismaFactory.create();

    try {
      const approval = await prisma.requisitionApproval.findUnique({
        where: { id },
        include: {
          role: {
            select: {
              roleName: true,
            },
          },
          requisition: {
            include: {
              customer: true,
              product: true,
              testingReason: true,
            },
          },
        },
      });

      if (!approval) {
        throw new NotFoundException('Requisition Approval Not Found');
      }

      return approval;
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(
    id: string,
    dto: UpdateRequisitionApprovalDto,
    userRoleId: string,
  ) {
    const prisma = this.prismaFactory.create();

    try {
      const approval = await prisma.requisitionApproval.findUnique({
        where: { id },
      });

      if (!approval) {
        throw new NotFoundException('Requisition Approval Not Found');
      }

      if (approval.roleId !== userRoleId) {
        throw new ForbiddenException(
          'You are not authorized to sign this requisition approval',
        );
      }

      if (approval.signature) {
        throw new BadRequestException(
          'This requisition approval has already been signed',
        );
      }

      const result = await prisma.requisitionApproval.updateMany({
        where: {
          id,
          signature: null,
        },
        data: {
          signature: dto.signature,
          signAt: new Date(),
        },
      });

      if (result.count === 0) {
        throw new BadRequestException(
          'This requisition approval has already been signed',
        );
      }

      return await prisma.requisitionApproval.findUnique({
        where: { id },
        include: {
          role: {
            select: {
              roleName: true,
            },
          },
          requisition: {
            select: {
              id: true,
              trialNo: true,
              revisionNo: true,
            },
          },
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
