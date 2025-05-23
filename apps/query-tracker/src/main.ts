import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { QUERY_TRACKER_SERVICE } from '@app/common';
import { QueryTrackerModule } from './query-tracker.module';

async function bootstrap() {
  const app = await NestFactory.create(QueryTrackerModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: QUERY_TRACKER_SERVICE,
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
