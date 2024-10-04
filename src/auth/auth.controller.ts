import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, SignUpUserDto } from './dtos';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UserService, UserDto } from 'src/users';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService, FileUploadDto } from 'src/files';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private filesService: FilesService,
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

  @Post('avatar-upload')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'User avatar',
    type: FileUploadDto,
  })
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
    @Req() req,
  ) {
    await this.filesService.upload(`${req.user.sub}-avatar.png`, file);
    return res.status(200).json('ok');
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
