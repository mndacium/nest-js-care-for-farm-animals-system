import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AnimalSpeciesDto, CreateEditAnimalSpeciesDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnimalSpeciesService } from './animals-species.service';
import { NotFoundAnimalSpecies } from './common';
import { AuthGuard } from 'src/auth';

@ApiTags('animal-species')
@Controller('animal-species')
export class AnimalSpeciesController {
  constructor(private animalSpeciesService: AnimalSpeciesService) {}

  @Get()
  async getAnimalSpeciess() {
    return await this.animalSpeciesService.getAllAnimalSpecies();
  }

  @Get(':id')
  async getAnimalSpecies(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AnimalSpeciesDto> {
    try {
      return await this.animalSpeciesService.getAnimalSpecies(id);
    } catch (error) {
      if (error instanceof NotFoundAnimalSpecies) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createAnimalSpecies(@Body() body: CreateEditAnimalSpeciesDto) {
    console.log(body);
    return await this.animalSpeciesService.createAnimalSpecies(body);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async editAnimalSpecies(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateEditAnimalSpeciesDto,
  ) {
    try {
      return await this.animalSpeciesService.editAnimalSpecies(body, id);
    } catch (error) {
      if (error instanceof NotFoundAnimalSpecies) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteAnimalSpecies(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.animalSpeciesService.deleteAnimalSpecies(id);
    } catch (error) {
      if (error instanceof NotFoundAnimalSpecies) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
