import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OpenweatherService {
  private readonly logger = new Logger(OpenweatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.getOrThrow('OPENWEATHER_API_KEY');
  }

  async getWeatherByCity(city: string): Promise<any> {
    const cacheKey = `weather_${city}`;

    try {
      const cachedData = await this.cache.get<string>(cacheKey);
      if (cachedData) {
        this.logger.log(`Returning cached data for ${city}`);
        return JSON.parse(cachedData);
      }

      const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
      const response = await firstValueFrom(this.httpService.get(url));
      const weatherData = response.data;

      await this.cache.set(cacheKey, JSON.stringify(weatherData), 600 * 1000);

      this.logger.log(`Fetched fresh data for ${city}`);
      return weatherData;
    } catch (error) {
      this.logger.error(`Error getting weather for ${city}: ${error.message}`);
      throw error;
    }
  }
}
