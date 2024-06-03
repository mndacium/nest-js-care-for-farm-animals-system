import { Module } from '@nestjs/common';
import { AnimalService } from './animals.service';
import { AnimalController } from './animals.controller';
import { MetricModule } from 'src/metrics';

@Module({
  imports: [MetricModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
