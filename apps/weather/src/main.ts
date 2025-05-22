import { NestFactory } from '@nestjs/core';
import { WeatherModule } from './weather.module';

async function bootstrap() {
  const app = await NestFactory.create(WeatherModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
