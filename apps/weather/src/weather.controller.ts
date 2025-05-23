import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { GetWeatherByCityDto } from './dto/get-weather-by-city.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWeather(
    @CurrentUser() user: User,
    @Query() query: GetWeatherByCityDto,
  ) {
    return await this.weatherService.getWeatherByCity(query.city, user);
  }
}
