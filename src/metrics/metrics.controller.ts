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
import { MetricDto, CreateEditMetricDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MetricService } from './metrics.service';
import { NotFoundMetric } from './common';
import { AuthGuard } from 'src/auth';

@ApiTags('metric')
@Controller('metric')
export class MetricController {
  constructor(private metricService: MetricService) {}

  @Get(':id')
  async getMetric(@Param('id', ParseIntPipe) id: number): Promise<MetricDto> {
    try {
      return await this.metricService.getMetric(id);
    } catch (error) {
      if (error instanceof NotFoundMetric) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @ApiBearerAuth()
  async createMetric(@Body() body: CreateEditMetricDto[]) {
    return await this.metricService.createMetric(body);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async editMetric(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateEditMetricDto,
  ) {
    try {
      return await this.metricService.editMetric(body, id);
    } catch (error) {
      if (error instanceof NotFoundMetric) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteMetric(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.metricService.deleteMetric(id);
    } catch (error) {
      if (error instanceof NotFoundMetric) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
