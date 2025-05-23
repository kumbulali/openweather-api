import { Injectable } from '@nestjs/common';
import { OpenweatherService } from './openweather/openweather.service';
import { User } from '@app/common';

@Injectable()
export class WeatherService {
  constructor(private readonly openweatherService: OpenweatherService) {}

  async getWeatherByCity(city: string, user: User) {
    return await this.openweatherService.getWeatherByCity(city, user.id);
  }
}
