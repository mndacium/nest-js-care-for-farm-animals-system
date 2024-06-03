import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEditAnimalDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  weight: number;

  @ApiProperty()
  @IsInt()
  speciesId: number;

  @ApiProperty()
  @IsInt()
  userId: number;
}
