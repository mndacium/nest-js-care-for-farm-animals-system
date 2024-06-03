import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AnimalSpeciesDto, CreateEditAnimalSpeciesDto } from './dtos';
import { NotFoundAnimalSpecies } from './common';

@Injectable()
export class AnimalSpeciesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllAnimalSpecies(): Promise<AnimalSpeciesDto[]> {
    return this.prismaService.animalSpecies.findMany({
      select: {
        id: true,
        name: true,
        minHeartbeat: true,
        maxHeartbeat: true,
        minRespirationRate: true,
        maxRespirationRate: true,
        minTemperature: true,
        maxTemperature: true,
      },
    });
  }

  public async getAnimalSpecies(id: number): Promise<AnimalSpeciesDto> {
    const animalSpecies = await this.prismaService.animalSpecies.findFirst({
      select: {
        id: true,
        name: true,
        minHeartbeat: true,
        maxHeartbeat: true,
        minRespirationRate: true,
        maxRespirationRate: true,
        minTemperature: true,
        maxTemperature: true,
      },
      where: {
        id,
      },
    });

    if (!animalSpecies) {
      throw new NotFoundAnimalSpecies('There is no animalSpecies with such id');
    }

    return animalSpecies;
  }

  public async createAnimalSpecies(
    req: CreateEditAnimalSpeciesDto,
  ): Promise<{ id: number }> {
    const animalSpecies = await this.prismaService.animalSpecies.create({
      data: {
        name: req.name,
        minHeartbeat: req.minHeartbeat,
        maxHeartbeat: req.maxHeartbeat,
        minRespirationRate: req.minRespirationRate,
        maxRespirationRate: req.maxRespirationRate,
        minTemperature: req.minTemperature,
        maxTemperature: req.maxTemperature,
      },
      select: {
        id: true,
      },
    });

    return {
      id: animalSpecies.id,
    };
  }

  public async editAnimalSpecies(
    req: CreateEditAnimalSpeciesDto,
    animalSpeciesId: number,
  ): Promise<{ id: number }> {
    const animalSpecies = await this.prismaService.animalSpecies.findFirst({
      select: {
        id: true,
      },
      where: {
        id: animalSpeciesId,
      },
    });

    if (!animalSpecies) {
      throw new NotFoundAnimalSpecies('There is no animalSpecies with such id');
    }

    await this.prismaService.animalSpecies.update({
      data: {
        name: req.name,
        minHeartbeat: req.minHeartbeat,
        maxHeartbeat: req.maxHeartbeat,
        minRespirationRate: req.minRespirationRate,
        maxRespirationRate: req.maxRespirationRate,
        minTemperature: req.minTemperature,
        maxTemperature: req.maxTemperature,
      },
      where: {
        id: animalSpeciesId,
      },
    });

    return {
      id: animalSpeciesId,
    };
  }

  public async deleteAnimalSpecies(id: number): Promise<void> {
    const animalSpecies = await this.prismaService.animalSpecies.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });

    if (!animalSpecies) {
      throw new NotFoundAnimalSpecies('There is no animalSpecies with such id');
    }

    await this.prismaService.animalSpecies.delete({
      where: {
        id,
      },
    });
  }
}
