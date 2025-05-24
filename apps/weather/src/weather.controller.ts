import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import {
  CurrentUser,
  IdDto,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
} from '@app/common';
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

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getWeatherHistory(@CurrentUser() user: User) {
    return await this.weatherService.getWeatherHistoryByUserId(user.id);
  }

  @Get('history/all')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async getAllWeatherHistory() {
    return await this.weatherService.getAllWeatherHistory();
  }

  @Get('history/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async getWeatherHistoryByUserId(@Param() params: IdDto) {
    return await this.weatherService.getWeatherHistoryByUserId(params.id);
  }
}
