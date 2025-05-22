import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenWeatherService {
  getHello(): string {
    return 'Hello World!';
  }
}
