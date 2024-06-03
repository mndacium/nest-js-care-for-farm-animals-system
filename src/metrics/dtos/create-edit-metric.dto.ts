import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber } from 'class-validator';

export class CreateEditMetricDto {
  @ApiProperty()
  @IsNumber()
  heartbeat: number;

  @ApiProperty()
  @IsNumber()
  respirationRate: number;

  @ApiProperty()
  @IsNumber()
  temperature: number;

  @ApiProperty()
  @IsDateString()
  timestamp: string;

  @ApiProperty()
  @IsInt()
  animalId: number;
}
