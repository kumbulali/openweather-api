import { NestFactory } from '@nestjs/core';
import { WeatherModule } from './weather.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  GlobalExceptionFilter,
  ResponseInterceptor,
  WEATHER_SERVICE,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(WeatherModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: WEATHER_SERVICE,
    },
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
