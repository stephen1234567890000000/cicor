import { NestFactory } from '@nestjs/core';
import { createServer } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import { WorkerAppModule } from './worker-app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WorkerAppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.init();

  const server = createServer(app.getHttpAdapter().getInstance());

  server.listen(3000);
}

void bootstrap();

export default httpServerHandler({ port: 3000 });
