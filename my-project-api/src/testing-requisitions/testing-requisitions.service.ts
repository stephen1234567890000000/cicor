import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestingRequisitionDto } from './dto/testing-requisitions.dto';

@Injectable()
export class TestingRequisitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTestingRequisitionDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer Not Found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const testingReason = await this.prisma.testingReason.findUnique({
      where: { id: dto.testingReasonId },
    });

    if (!testingReason) {
      throw new NotFoundException('Testing Reason Not Found');
    }

    const customerProduct = await this.prisma.customerProduct.findUnique({
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

    return this.prisma.$transaction(async (tx) => {
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

      return tx.testingRequisition.create({
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
        },
        include: {
          customer: true,
          product: true,
          testingReason: true,
        },
      });
    });
  }

  async findAll(page = 1, limit = 10) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and Limit should greater than 0');
    }

    if (limit > 100) {
      throw new BadRequestException('Limit max is 100');
    }

    const skip = (page - 1) * limit;

    const data = await this.prisma.testingRequisition.findMany({
      skip,
      take: limit,
      include: {
        customer: true,
        product: true,
        testingReason: true,
      },
      orderBy: {
        testDate: 'desc',
      },
    });

    const total = await this.prisma.testingRequisition.count();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}
