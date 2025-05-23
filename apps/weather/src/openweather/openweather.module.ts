import { Module } from '@nestjs/common';
import { OpenweatherService } from './openweather.service';
import { HttpModule } from '@nestjs/axios';
import { QUERY_TRACKER_SERVICE, RedisCacheModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    RedisCacheModule,
    ClientsModule.registerAsync([
      {
        name: QUERY_TRACKER_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: QUERY_TRACKER_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [OpenweatherService],
  exports: [OpenweatherService],
})
export class OpenweatherModule {}
