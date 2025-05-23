import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { RolesEnum } from '@app/common';
import { RolesSeederService } from './roles.seeder';

@Injectable()
export class DefaultAdminUserSeederService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(DefaultAdminUserSeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly rolesSeeder: RolesSeederService,
  ) {}

  async onApplicationBootstrap() {
    await this.rolesSeeder.seedRoles();
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail =
      this.configService.get('ADMIN_EMAIL') || 'admin@example.com';
    const adminPassword =
      this.configService.get('ADMIN_PASSWORD') || 'admin123';

    const existingAdmin = await this.prismaService.user.findFirst({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminRole = await this.prismaService.role.findFirst({
        where: { name: RolesEnum.ADMIN },
      });

      await this.prismaService.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          roles: {
            connect: [adminRole!],
          },
        },
      });
      this.logger.log(`Admin user created: ${adminEmail}`);
    } else {
      this.logger.warn('Admin user already exists');
    }
  }
}
