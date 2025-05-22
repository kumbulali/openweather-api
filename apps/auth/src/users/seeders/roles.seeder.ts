import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Role, RolesEnum } from '@app/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RolesSeederService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(RolesSeederService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedAdminRole();
    await this.seedUserRole();
  }

  private async seedAdminRole() {
    const existingAdminRole = await this.prismaService.role.findFirst({
      where: { name: RolesEnum.ADMIN },
    });

    if (!existingAdminRole) {
      await this.prismaService.role.create({
        data: { name: RolesEnum.ADMIN },
      });
      this.logger.log(`Admin role created: ${RolesEnum.ADMIN}`);
    } else {
      this.logger.warn('Admin role already exists');
    }
  }

  private async seedUserRole() {
    const existingUserRole = await this.prismaService.role.findFirst({
      where: { name: RolesEnum.USER },
    });

    if (!existingUserRole) {
      await this.prismaService.role.create({ data: { name: RolesEnum.USER } });
      this.logger.log(`User role created: ${RolesEnum.USER}`);
    } else {
      this.logger.warn('User role already exists');
    }
  }
}
