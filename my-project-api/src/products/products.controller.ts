import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('processId') processId?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.productsService.findAll(
      processId?.trim() || undefined,
      customerId?.trim() || undefined,
    );
  }
}
