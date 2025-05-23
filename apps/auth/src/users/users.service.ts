import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';
import { Role, RolesEnum } from '@app/common';
import { omit } from 'lodash';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);

    try {
      const roles = await this.handleUserRoles(createUserDto.roles);

      return await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          password: await bcrypt.hash(createUserDto.password, 10),
          roles: {
            connect: roles.map((role) => ({ id: role.id })),
          },
        },
        select: {
          id: true,
          email: true,
          roles: { select: { name: true } },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
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

    return omit(user, ['password']);
  }

  async getUser(getUserDto: GetUserDto) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: +getUserDto.id,
        },
        select: { id: true, email: true, roles: true },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('User not found.');
      throw error;
    }
  }

  async getAllUsers() {
    return await this.prismaService.user.findMany({
      select: { id: true, email: true, roles: true },
    });
  }

  async deleteUser(userId: string | number) {
    try {
      return await this.prismaService.user.delete({
        where: { id: +userId },
        select: { id: true },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('User not found.');
      throw error;
    }
  }

  async updateUser(userId: string | number, updateUserDto: UpdateUserDto) {
    try {
      const updateData: any = {
        ...updateUserDto,
        password: updateUserDto.password
          ? await bcrypt.hash(updateUserDto.password, 10)
          : undefined,
      };

      if (updateUserDto.roles) {
        const roles = await this.prismaService.role.findMany({
          where: {
            name: {
              in: updateUserDto.roles,
            },
          },
        });

        if (roles.length === 0) {
          throw new BadRequestException('No valid roles found');
        }

        updateData.roles = {
          set: roles.map((role) => ({ id: role.id })),
        };
      }

      return await this.prismaService.user.update({
        where: { id: +userId },
        data: updateData,
        select: { id: true, email: true, roles: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  private async handleUserRoles(requestedRoles?: string[]): Promise<Role[]> {
    const rolesToAssign = requestedRoles?.length
      ? requestedRoles
      : [RolesEnum.USER];

    const roles = await this.prismaService.role.findMany({
      where: { name: { in: rolesToAssign } },
    });

    if (roles.length !== rolesToAssign.length) {
      const missingRoles = rolesToAssign.filter(
        (roleName) => !roles.some((r) => r.name === roleName),
      );
      throw new BadRequestException(
        `Invalid roles provided: ${missingRoles.join(', ')}`,
      );
    }

    return roles;
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
}
