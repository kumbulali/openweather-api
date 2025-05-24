import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WeatherQuery } from '@app/common';
import {
  UserWeatherQueryHistory,
  WeatherQueryHistory,
} from './interfaces/weather-query-history.interface';

@Injectable()
export class QueryTrackerService {
  constructor(private readonly prismaService: PrismaService) {}
  async saveQuery(weatherQuery: WeatherQuery) {
    return await this.prismaService.weatherquery.create({
      data: weatherQuery,
    });
  }

  async getQueryHistoryByUserId(
    userId: number,
  ): Promise<WeatherQueryHistory[]> {
    return await this.prismaService.weatherquery.findMany({
      where: { userId },
    });
  }

  async getAllQueryHistory(): Promise<UserWeatherQueryHistory[]> {
    const allQueries = await this.prismaService.weatherquery.findMany({
      orderBy: [{ userId: 'asc' }, { createdAt: 'desc' }],
    });

    const grouped = allQueries.reduce((acc, query) => {
      const existingGroup = acc.find((g) => g.userId === query.userId);
      if (existingGroup) {
        existingGroup.history.push(query);
      } else {
        acc.push({
          userId: query.userId,
          history: [query],
        });
      }
      return acc;
    }, [] as UserWeatherQueryHistory[]);

    return grouped;
  }
}
