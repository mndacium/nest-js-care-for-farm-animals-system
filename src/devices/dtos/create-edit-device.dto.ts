import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateEditDeviceDto {
  @ApiProperty()
  @IsInt()
  animalId: number;
}
