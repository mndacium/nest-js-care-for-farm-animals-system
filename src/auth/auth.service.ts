import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dtos';
import { UserService } from '../users';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpUserDto } from './dtos';
import { roles } from 'prisma/seed';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpUserDto: SignUpUserDto) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const password = await bcrypt.hash(signUpUserDto.password, salt);

    const createdUser = await this.prismaService.user.create({
      data: {
        login: signUpUserDto.login,
        firstName: signUpUserDto.firstName,
        lastName: signUpUserDto.lastName,
        password,
        roleId: roles.user.id,
      },
    });

    if (!createdUser) {
      throw new Error('Error while creating user');
    }

    return createdUser;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userService.getUserLoginData(loginUserDto);

    const match = await bcrypt.compare(loginUserDto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      login: user.login,
      admin: user.role.id === roles.admin.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
