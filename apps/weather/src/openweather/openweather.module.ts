import { Module } from '@nestjs/common';
import { OpenweatherService } from './openweather.service';
import { HttpModule } from '@nestjs/axios';
import { RedisCacheModule } from '@app/common';

@Module({
  imports: [HttpModule, RedisCacheModule],
  controllers: [],
  providers: [OpenweatherService],
  exports: [OpenweatherService],
})
export class OpenweatherModule {}
