import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEditAnimalSpeciesDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsInt()
  minHeartbeat: number;

  @ApiProperty()
  @IsInt()
  maxHeartbeat: number;

  @ApiProperty()
  @IsInt()
  minRespirationRate: number;

  @ApiProperty()
  @IsInt()
  maxRespirationRate: number;

  @ApiProperty()
  @IsInt()
  minTemperature: number;

  @ApiProperty()
  @IsInt()
  maxTemperature: number;
}
