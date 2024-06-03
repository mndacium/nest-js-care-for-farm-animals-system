import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, SignUpUserDto } from './dtos';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UserService, UserDto } from 'src/users';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    return await this.authService.signUp(signUpUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(loginUserDto);

    res.cookie('access_token', accessToken, {
      expires: new Date(new Date().getTime() + 30 * 60000 * 1000),
      httpOnly: true,
      path: '/',
    });
    return res.status(200).json('Logged succesfully');
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', null, {
      maxAge: -1,
      httpOnly: true,
      path: '/',
    });
    return res.status(200).json('Logged out succesfully');
  }

  @Get('/user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'lang', required: false })
  public async getUser(@Req() req, @Query() query): Promise<UserDto> {
    return this.userService.getUser({
      login: req.user.login,
      language: query.lang,
    });
  }
}
