import { Module } from '@nestjs/common';
import { OpenWeatherController } from './openweather.controller';
import { OpenWeatherService } from './openweather.service';

@Module({
  imports: [],
  controllers: [OpenWeatherController],
  providers: [OpenWeatherService],
})
export class OpenWeatherModule {}
