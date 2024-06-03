import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { UserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

    return {
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      role: {
        id: usersRole.id,
        name: usersRole.name,
      },
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
