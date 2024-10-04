import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { UserDto } from './dtos';
import { FilesService } from 'src/files';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  public async getUser({
    login,
    language,
  }: {
    login: string;
    language?: string;
  }): Promise<UserDto> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        roleId: true,
      },
      where: {
        login,
      },
    });

    const usersRole = await this.prismaService.role.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: user.roleId,
        language,
      },
    });

    if (!user) {
      throw new NotFoundException('There is no user with such login');
    }

    const avatar = await this.filesService.download(`${user.id}-avatar.png`);

    return {
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      role: {
        id: usersRole.id,
        name: usersRole.name,
      },
      avatar,
    };
  }

  public async getUserLoginData({
    login,
    language,
  }: {
    login: string;
    language?: string;
  }) {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        login: true,
        password: true,
        roleId: true,
      },
      where: {
        login,
      },
    });

    if (!user) {
      throw new NotFoundException('There is no user with such login');
    }

    const usersRole = await this.prismaService.role.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: user.roleId,
        language,
      },
    });

    return {
      id: user.id,
      login: user.login,
      password: user.password,
      role: {
        id: usersRole.id,
        name: usersRole.name,
      },
    };
  }
}
