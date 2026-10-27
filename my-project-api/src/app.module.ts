import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { MaterialsModule } from './materials/materials.module';
import { ProcessesModule } from './processes/processes.module';
import { CustomersModule } from './customers/customers.module';
import { TestingReasonsModule } from './testing-reasons/testing-reasons.module';
import { ProductsModule } from './products/products.module';
import { TestingRequisitionsModule } from './testing-requisitions/testing-requisitions.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'my-project-api',
    }),
    AuthModule,
    ItemsModule,
    MaterialsModule,
    ProcessesModule,
    CustomersModule,
    TestingReasonsModule,
    ProductsModule,
    TestingRequisitionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
