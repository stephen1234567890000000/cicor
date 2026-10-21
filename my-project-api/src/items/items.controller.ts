import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@Query('role') role = '') {
    return this.itemsService.findAll(role);
  }

  @Post()
  async create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }
}
