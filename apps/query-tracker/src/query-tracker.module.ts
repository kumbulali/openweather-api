import { Module } from '@nestjs/common';
import { QueryTrackerController } from './query-tracker.controller';
import { QueryTrackerService } from './query-tracker.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
      }),
    }),
  ],
  controllers: [QueryTrackerController],
  providers: [QueryTrackerService, PrismaService],
})
export class QueryTrackerModule {}
