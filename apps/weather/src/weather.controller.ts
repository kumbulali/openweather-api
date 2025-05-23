import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '@app/common';
import { GetWeatherByCityDto } from './dto/get-weather-by-city.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWeather(@Query() query: GetWeatherByCityDto) {
    return await this.weatherService.getWeatherByCity(query.city);
  }
}
