import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '@app/common';
import { User } from '.prisma/client';
import { omit } from 'lodash';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@CurrentUser() user: User) {
    const token = await this.authService.login(user);
    return { token, user: omit(user, ['password']) };
  }

  @Get('me')
  async me(@CurrentUser() user: User) {
    return user;
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
