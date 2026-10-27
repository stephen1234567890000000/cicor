import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.customer.findMany({
      include: {
        customerProducts: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        customerName: 'asc',
      },
    });
  }
}
