import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WorkerAppController } from './worker-app.controller';
import { createWorkerPrisma } from './worker-prisma';
import { env } from 'cloudflare:workers';
import { WorkerItemsService } from './worker-items.service';
import { WorkerAuthController } from './worker-auth.controller';
import { WorkerAuthService } from './worker-auth.service';
import { WorkerJwtGuard } from './worker-jwt.guard';

@Module({
  controllers: [WorkerAppController, WorkerAuthController],
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
  ],
})
export class WorkerAppModule {}
