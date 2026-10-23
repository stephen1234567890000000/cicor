import { NestFactory } from '@nestjs/core';
import { createServer } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import { WorkerAppModule } from './worker-app.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerAppModule);
  await app.init();

  const server = createServer(app.getHttpAdapter().getInstance());

  server.listen(3000);
}

void bootstrap();

export default httpServerHandler({ port: 3000 });
