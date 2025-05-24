import { Controller, Get } from '@nestjs/common';
import { QueryTrackerService } from './query-tracker.service';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { IdDto, WeatherQuery } from '@app/common';
import {
  UserWeatherQueryHistory,
  WeatherQueryHistory,
} from './interfaces/weather-query-history.interface';

@Controller()
export class QueryTrackerController {
  constructor(private readonly queryTrackerService: QueryTrackerService) {}

  @EventPattern('weather_inquiry')
  async weatherInquiry(@Payload() payload: WeatherQuery) {
    try {
      return this.queryTrackerService.saveQuery(payload);
    } catch (error) {
      throw new RpcException({
        statusCode: error.code,
        message: error.message,
      });
    }
  }

  @MessagePattern('user_history')
  async getQueryHistoryByUserId(
    @Payload() payload: IdDto,
  ): Promise<WeatherQueryHistory[]> {
    try {
      return await this.queryTrackerService.getQueryHistoryByUserId(payload.id);
    } catch (error) {
      throw new RpcException({
        statusCode: error.code,
        message: error.message,
      });
    }
  }

  @MessagePattern('all_history')
  async getAllQueryHistory(): Promise<UserWeatherQueryHistory[]> {
    try {
      return await this.queryTrackerService.getAllQueryHistory();
    } catch (error) {
      throw new RpcException({
        statusCode: error.code,
        message: error.message,
      });
    }
  }
}
