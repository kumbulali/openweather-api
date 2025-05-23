import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenweatherService } from './openweather/openweather.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly openweatherService: OpenweatherService,
  ) {}

  async getWeatherByCity(city: string) {
    return await this.openweatherService.getWeatherByCity(city);
  }
}
