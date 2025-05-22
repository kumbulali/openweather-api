import { NestFactory } from '@nestjs/core';
import { OpenWeatherModule } from './openweather.module';

async function bootstrap() {
  const app = await NestFactory.create(OpenWeatherModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
