import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateItemDto } from './items/dto/create-item.dto';
import { UpdateItemDto } from './items/dto/update-item.dto';

@Injectable()
export class WorkerItemsService {
  constructor(
    @Inject('WORKER_PRISMA')
    private readonly prismaFactory: {
      create: () => PrismaClient;
    },
  ) {}

  async findAll(role: string) {
    const roles = [
      'Planner',
      'Project Engineering',
      'Molding',
      'QA Engineering',
      'Finance',
    ];

    if (!roles.includes(role)) {
      throw new ForbiddenException('Invalid role');
    }

    const prisma = this.prismaFactory.create();

    try {
      const items = await prisma.item.findMany({
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

      return items.map((item, i) => {
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

          case 'Molding':
            return {
              ...commonFields,
              mould: item.mouldNo,
              equipment: item.equipmentNo,
              material: item.material?.name ?? null,
              rm: item.rm,
            };

          case 'Finance':
            return {
              ...commonFields,
              price: item.price?.toString() ?? null,
            };

          default:
            throw new ForbiddenException('Role not allowed');
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async create(dto: CreateItemDto) {
    const prisma = this.prismaFactory.create();

    try {
      return await prisma.item.create({
        data: {
          sapPn: dto.sapPn,
          starkeyPn: dto.starkeyPn,
          itemName: dto.itemName,
          mouldNo: dto.mouldNo,
          equipmentNo: dto.equipmentNo,
          testing: dto.testing ?? false,
          sapPnAlt: dto.sapPnAlt,
          rm: dto.rm,
          materialId: dto.materialId,
        },
        include: {
          material: true,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async softDelete(id: string) {
    const prisma = this.prismaFactory.create();

    try {
      const existingItem = await prisma.item.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingItem) {
        throw new NotFoundException('Item Not Found');
      }

      return await prisma.item.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async replace(id: string, dto: UpdateItemDto) {
    const prisma = this.prismaFactory.create();

    try {
      const existingItem = await prisma.item.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingItem) {
        throw new NotFoundException('Item Not Found');
      }

      return await prisma.item.update({
        where: { id },
        data: {
          ...(dto.sapPn !== undefined && { sapPn: dto.sapPn }),
          ...(dto.starkeyPn !== undefined && {
            starkeyPn: dto.starkeyPn,
          }),
          ...(dto.itemName !== undefined && {
            itemName: dto.itemName,
          }),
          ...(dto.mouldNo !== undefined && {
            mouldNo: dto.mouldNo,
          }),
          ...(dto.equipmentNo !== undefined && {
            equipmentNo: dto.equipmentNo,
          }),
          ...(dto.testing !== undefined && {
            testing: dto.testing,
          }),
          ...(dto.sapPnAlt !== undefined && {
            sapPnAlt: dto.sapPnAlt,
          }),
          ...(dto.rm !== undefined && { rm: dto.rm }),
          ...(dto.materialId !== undefined && {
            materialId: dto.materialId,
          }),
        },
        include: {
          material: true,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
