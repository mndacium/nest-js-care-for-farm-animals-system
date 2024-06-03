import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AnimalDto, CreateEditAnimalDto } from './dtos';
import { NotFoundAnimal } from './common';

@Injectable()
export class AnimalService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAnimals(userId: number): Promise<AnimalDto[]> {
    const animals = await this.prismaService.animal.findMany({
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        weight: true,
        user: {
          select: {
            id: true,
            login: true,
          },
        },
        species: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        userId,
      },
    });

    return animals.map((animal) => ({
      id: animal.id,
      name: animal.name,
      dateOfBirth: animal.dateOfBirth.toISOString(),
      gender: animal.gender,
      weight: animal.weight,
      species: {
        id: animal.species.id,
        name: animal.species.name,
      },
      user: {
        id: animal.user.id,
        login: animal.user.login,
      },
    }));
  }

  public async getAnimal(id: number): Promise<AnimalDto> {
    const animal = await this.prismaService.animal.findFirst({
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        gender: true,
        weight: true,
        user: {
          select: {
            id: true,
            login: true,
          },
        },
        species: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!animal) {
      throw new NotFoundAnimal('There is no animal with such id');
    }

    return {
      id: animal.id,
      name: animal.name,
      dateOfBirth: animal.dateOfBirth.toISOString(),
      gender: animal.gender,
      weight: animal.weight,
      species: {
        id: animal.species.id,
        name: animal.species.name,
      },
      user: {
        id: animal.user.id,
        login: animal.user.login,
      },
    };
  }

  public async createAnimal(req: CreateEditAnimalDto): Promise<{ id: number }> {
    const animal = await this.prismaService.animal.create({
      data: {
        name: req.name,
        dateOfBirth: req.dateOfBirth,
        userId: req.userId,
        speciesId: req.speciesId,
        gender: req.gender,
        weight: req.weight,
      },
      select: {
        id: true,
      },
    });

    return {
      id: animal.id,
    };
  }

  public async editAnimal(
    req: CreateEditAnimalDto,
    animalId: number,
  ): Promise<{ id: number }> {
    const animal = await this.prismaService.animal.findFirst({
      select: {
        id: true,
      },
      where: {
        id: animalId,
      },
    });

    if (!animal) {
      throw new NotFoundAnimal('There is no animal with such id');
    }

    await this.prismaService.animal.update({
      data: {
        name: req.name,
        dateOfBirth: req.dateOfBirth,
        userId: req.userId,
        speciesId: req.speciesId,
        gender: req.gender,
        weight: req.weight,
      },
      where: {
        id: animalId,
      },
    });

    return {
      id: animalId,
    };
  }

  public async deleteAnimal(id: number): Promise<void> {
    const animal = await this.prismaService.animal.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });

    if (!animal) {
      throw new NotFoundAnimal('There is no animal with such id');
    }

    await this.prismaService.animal.delete({
      where: {
        id,
      },
    });
  }
}
