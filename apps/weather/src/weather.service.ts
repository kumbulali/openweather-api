import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OpenweatherService } from './openweather/openweather.service';
import {
  AUTH_SERVICE,
  handleRpcCall,
  QUERY_TRACKER_SERVICE,
  User,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private readonly openweatherService: OpenweatherService,
    @Inject(QUERY_TRACKER_SERVICE)
    private readonly queryTrackerService: ClientProxy,
    @Inject(AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  async getWeatherByCity(city: string, user: User) {
    return await this.openweatherService.getWeatherByCity(city, user.id);
  }

  async getWeatherHistoryByUserId(userId: number) {
    const foundUser: User = await handleRpcCall(
      this.authService.send('user_detail', { id: userId.toString() }),
    );
    if (!foundUser) throw new NotFoundException('User not found.');

    const queryHistory = await handleRpcCall(
      this.queryTrackerService.send('user_history', { id: foundUser.id }),
    );
    return {
      user: foundUser,
      queryHistory,
    };
  }
  async getAllWeatherHistory() {
    return await handleRpcCall(
      this.queryTrackerService.send('all_history', {}),
    );
  }
}
