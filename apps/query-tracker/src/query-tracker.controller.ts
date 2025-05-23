import { Controller, Get } from '@nestjs/common';
import { QueryTrackerService } from './query-tracker.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WeatherQuery } from '@app/common';

@Controller()
export class QueryTrackerController {
  constructor(private readonly queryTrackerService: QueryTrackerService) {}

  @EventPattern('weather_inquiry')
  async weatherInquiry(@Payload() payload: WeatherQuery) {
    return this.queryTrackerService.saveQuery(payload);
  }
}
