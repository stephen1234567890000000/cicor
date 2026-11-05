import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRequisitionApprovalDto } from './dto/update-requisition-approval.dto';

@Injectable()
export class RequisitionApprovalService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const approval = await this.prisma.requisitionApproval.findUnique({
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
  }

  async update(
    id: string,
    dto: UpdateRequisitionApprovalDto,
    userRoleId: string,
  ) {
    const approval = await this.prisma.requisitionApproval.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            roleName: true,
          },
        },
      },
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

    const result = await this.prisma.requisitionApproval.updateMany({
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

    return this.prisma.requisitionApproval.findUnique({
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
  }
}
