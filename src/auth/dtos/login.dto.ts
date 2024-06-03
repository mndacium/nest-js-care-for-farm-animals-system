import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiPropertyOptional()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;
}
