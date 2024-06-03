import { Module } from '@nestjs/common';
import { AnimalSpeciesService } from './animals-species.service';
import { AnimalSpeciesController } from './animals-species.controller';

@Module({
  controllers: [AnimalSpeciesController],
  providers: [AnimalSpeciesService],
})
export class AnimalSpeciesModule {}
