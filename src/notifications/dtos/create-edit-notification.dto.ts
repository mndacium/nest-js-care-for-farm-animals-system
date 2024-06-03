import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEditNotificationDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(250)
  message: string;

  @ApiProperty()
  @IsInt()
  animalId: number;
}
