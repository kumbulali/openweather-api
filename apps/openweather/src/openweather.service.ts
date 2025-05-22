import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class OpenWeatherService {
  constructor(private readonly prismaService: PrismaService) {}

  async create() {}
}
