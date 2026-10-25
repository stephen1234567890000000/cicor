import {
  Controller,
  Req,
  Body,
  Get,
  Patch,
  Post,
  Put,
  Inject,
  NotFoundException,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { createWorkerPrisma } from './worker-prisma';
import { WorkerItemsService } from './worker-items.service';
import { CreateItemDto } from './items/dto/create-item.dto';
import { UpdateItemDto } from './items/dto/update-item.dto';
import { WorkerJwtGuard } from './worker-jwt.guard';
import { Request } from 'express';

@Controller()
export class WorkerAppController {
  constructor(
    @Inject('WORKER_PRISMA')
    private readonly prismaFactory: {
      create: () => ReturnType<typeof createWorkerPrisma>;
    },

    @Inject(WorkerItemsService)
    private readonly workerItemsService: WorkerItemsService,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Cicor API is running on Cloudflare Workers',
    };
  }

  @Get('db-check')
  async checkDatabase() {
    const prisma = this.prismaFactory.create();

    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        message: 'Supabase database connection successful',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  @Get('items')
  @UseGuards(WorkerJwtGuard)
  async getItems(
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.workerItemsService.findAll(req.user.role);
  }

  @Get('items/:id')
  @UseGuards(WorkerJwtGuard)
  async getItemById(@Param('id') id: string) {
    const prisma = this.prismaFactory.create();

    try {
      const item = await prisma.item.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          material: true,
        },
      });

      if (!item) {
        throw new NotFoundException('Item Not Found');
      }

      return item;
    } finally {
      await prisma.$disconnect();
    }
  }

  @Post('items')
  @UseGuards(WorkerJwtGuard)
  async createItem(@Body() dto: CreateItemDto) {
    return this.workerItemsService.create(dto);
  }

  @Patch('items/:id')
  @UseGuards(WorkerJwtGuard)
  async softDelete(@Param('id') id: string) {
    return this.workerItemsService.softDelete(id);
  }

  @Put('items/:id')
  @UseGuards(WorkerJwtGuard)
  async putItem(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.workerItemsService.replace(id, dto);
  }
}
