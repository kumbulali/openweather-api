import { Controller, Get, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '@app/common';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello() {
    return await this.weatherService.create();
  }
}
