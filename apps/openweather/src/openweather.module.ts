import { Module } from '@nestjs/common';
import { OpenWeatherController } from './openweather.controller';
import { OpenWeatherService } from './openweather.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [OpenWeatherController],
  providers: [OpenWeatherService, PrismaService],
})
export class OpenWeatherModule {}
