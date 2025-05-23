import { Injectable, Logger } from '@nestjs/common';
import { Role, RolesEnum } from '@app/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RolesSeederService {
  protected readonly logger = new Logger(RolesSeederService.name);
  private roles: Role[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  public async seedRoles(): Promise<Role[]> {
    await this.seedAdminRole();
    await this.seedUserRole();
    return this.prismaService.role.findMany();
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
