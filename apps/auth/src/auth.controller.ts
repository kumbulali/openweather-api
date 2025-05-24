import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, User } from '@app/common';
import { omit } from 'lodash';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User) {
    const token = await this.authService.login(user);
    return { token, user: omit(user, ['password']) };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return omit(user, ['password']);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
