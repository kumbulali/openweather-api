import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WeatherQuery } from '@app/common';

@Injectable()
export class QueryTrackerService {
  constructor(private readonly prismaService: PrismaService) {}
  async saveQuery(weatherQuery: WeatherQuery) {
    console.log(weatherQuery);
    return await this.prismaService.weatherquery.create({
      data: weatherQuery,
    });
  }
}
