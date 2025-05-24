import { Injectable, Logger, Inject, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { handleRpcCall, QUERY_TRACKER_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { WeatherResponse } from './interfaces/weather-response.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenweatherService {
  private readonly logger = new Logger(OpenweatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(QUERY_TRACKER_SERVICE)
    private readonly queryTrackerService: ClientProxy,
  ) {
    this.apiKey = this.configService.getOrThrow('OPENWEATHER_API_KEY');
  }

  async getWeatherByCity(
    city: string,
    userId: number,
  ): Promise<WeatherResponse> {
    const cacheKey = `weather_${city}`;

    try {
      const cachedData = await this.cache.get<string>(cacheKey);
      if (cachedData) {
        const weatherResponse: WeatherResponse = JSON.parse(cachedData);
        this.logger.log(`Returning cached data for ${city}`);
        this.queryTrackerService.emit('weather_inquiry', {
          userId,
          location: weatherResponse.name,
          temp: weatherResponse.main.temp,
          conditions: weatherResponse.weather.map(
            (weather) => weather.description,
          ),
          cached: true,
        });
        return weatherResponse;
      }

      const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
      const response = await firstValueFrom(this.httpService.get(url));
      const weatherData: WeatherResponse = response.data;

      await this.cache.set(cacheKey, JSON.stringify(weatherData));
      this.queryTrackerService.emit('weather_inquiry', {
        userId,
        location: weatherData.name,
        temp: weatherData.main.temp,
        conditions: weatherData.weather.map((weather) => weather.description),
        cached: false,
      });
      this.logger.log(`Fetched fresh data for ${city}`);
      return weatherData;
    } catch (error) {
      this.logger.error(`Error getting weather for ${city}: ${error.message}`);
      throw new HttpException(
        `Error occurred for city '${city}': ${error.response.data.message}`,
        Number(error.response.data.cod),
      );
    }
  }
}
