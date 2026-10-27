import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(processId?: string, customerId?: string) {
    return await this.prisma.product.findMany({
      where: {
        ...(processId && { processId: processId }),
        ...(customerId && { customerProducts: { some: { customerId } } }),
      },
      orderBy: {
        productName: 'asc',
      },
    });
  }
}
