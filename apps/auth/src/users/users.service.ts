import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';
import { RolesEnum } from '@app/common';
import { omit } from 'lodash';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);

    const roles = await this.prismaService.role.findMany({
      where: {
        name: {
          in: createUserDto.roles?.length
            ? createUserDto.roles
            : [RolesEnum.USER],
        },
      },
    });

    const createdUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
        roles: {
          connect: roles,
        },
      },
      include: {
        roles: true,
      },
    });

    return omit(createdUser, ['password']);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUserDto.email },
      });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      include: {
        roles: true,
      },
    });
    if (!user) throw new UnauthorizedException('Credentials are not valid.');

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('Credentials are not valid.');

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: +getUserDto.id,
      },
      include: {
        roles: true,
      },
    });
  }
}
