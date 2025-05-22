import { Controller, Get } from '@nestjs/common';
import { OpenWeatherService } from './openweather.service';

@Controller()
export class OpenWeatherController {
  constructor(private readonly openWeatherService: OpenWeatherService) {}

  @Get()
  getHello(): string {
    return this.openWeatherService.getHello();
  }
}
