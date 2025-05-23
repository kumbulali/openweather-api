import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { DefaultAdminUserSeederService } from './seeders/admin.seeder';
import { RolesSeederService } from './seeders/roles.seeder';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    RolesSeederService,
    DefaultAdminUserSeederService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
