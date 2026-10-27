import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WorkerAppController } from './worker-app.controller';
import { createWorkerPrisma } from './worker-prisma';
import { env } from 'cloudflare:workers';
import { WorkerItemsService } from './worker-items.service';
import { WorkerAuthController } from './worker-auth.controller';
import { WorkerAuthService } from './worker-auth.service';
import { WorkerJwtGuard } from './worker-jwt.guard';
import { WorkerMasterDataService } from './worker-master-data.service';
import { WorkerMasterDataController } from './worker-master-data.controller';
import { WorkerTestingRequisitionsController } from './worker-testing-requisitions.controller';
import { WorkerTestingRequisitionsService } from './worker-testing-requisitions.service';

@Module({
  controllers: [
    WorkerAppController,
    WorkerAuthController,
    WorkerMasterDataController,
    WorkerTestingRequisitionsController,
  ],
  providers: [
    AppService,
    {
      provide: 'WORKER_PRISMA',
      useFactory: () => ({
        create: () => createWorkerPrisma(env.HYPERDRIVE.connectionString),
      }),
    },
    WorkerItemsService,
    WorkerAuthService,
    WorkerJwtGuard,
    WorkerMasterDataService,
    WorkerTestingRequisitionsService,
  ],
})
export class WorkerAppModule {}
