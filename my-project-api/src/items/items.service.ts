import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(role: string) {
    const roles = [
      'Planner',
      'Project Engineering',
      'Molding',
      'QA Engineering',
    ];

    if (!roles.includes(role)) {
      throw new ForbiddenException('Invalid role');
    }

    const items = await this.prisma.item.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        material: true,
      },
      orderBy: {
        itemName: 'asc',
      },
    });

    return items.map((item: any, i: number) => {
      const commonFields = {
        no: i + 1,
        sapPn: item.sapPn,
        starkeyPn: item.starkeyPn,
        itemName: item.itemName,
      };

      switch (role) {
        case 'Planner':
          return {
            ...commonFields,
            mould: item.mouldNo,
            equipment: item.equipmentNo,
            material: item.material?.name ?? null,
            rm: item.rm,
          };

        case 'Project Engineering':
          return {
            ...commonFields,
            mould: item.mouldNo,
            testing: item.testing,
            equipment: item.equipmentNo,
            material: item.material?.name ?? null,
            rm: item.rm,
          };

        case 'QA Engineering':
          return {
            ...commonFields,
            testing: item.testing,
            rm: item.rm,
          };

        case 'Finance':
          return {
            ...commonFields,
            price: item.price,
          };

        default:
          throw new ForbiddenException('Role tidak memiliki akses ke items');
      }
    });
  }
}
