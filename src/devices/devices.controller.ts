import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceService } from './devices.service';
import { CreateEditDeviceDto } from './dtos';

@ApiTags('device')
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get(':id')
  async getDevice(@Param('id', ParseIntPipe) id: number) {
    return await this.deviceService.getDevice(id);
  }

  @Post()
  async createDevice(@Body() { animalId }: CreateEditDeviceDto) {
    const res = await this.deviceService.createDevice(animalId);
    return res;
  }

  @Put(':id')
  @ApiBearerAuth()
  async editDevice(
    @Param('id', ParseIntPipe) id: number,
    @Body() { animalId }: CreateEditDeviceDto,
  ) {
    return await this.deviceService.editDevice(id, animalId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async deleteDevice(@Param('id', ParseIntPipe) id: number) {
    return await this.deviceService.deleteDevice(id);
  }
}
