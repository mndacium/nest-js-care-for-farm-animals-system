import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnalitycsDto, GetAnalitycsRequestDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalitycsService } from './analitycs.service';
import { AuthGuard } from 'src/auth';

@ApiTags('analitycs')
@Controller('analitycs')
export class AnalitycsController {
  constructor(private analitycsService: AnalitycsService) {}

  @Post(':animalId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getAverageMetricsAnalitycs(
    @Param('animalId', ParseIntPipe) animalId: number,
    @Body() req: GetAnalitycsRequestDto,
  ): Promise<AnalitycsDto> {
    return await this.analitycsService.getAverageMetricsAnalitycs(
      animalId,
      req,
    );
  }
}
