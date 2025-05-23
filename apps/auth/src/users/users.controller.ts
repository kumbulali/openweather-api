import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles, RolesEnum } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async getUserById(@Param() params: GetUserDto) {
    return await this.usersService.getUser(params);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteUser(@Param() params: GetUserDto) {
    return await this.usersService.deleteUser(params.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async updateUser(
    @Param() params: GetUserDto,
    @Body() updateUser: CreateUserDto,
  ) {
    return await this.usersService.updateUser(params.id, updateUser);
  }
}
