import { Module } from '@nestjs/common';
import { DeviceService } from './devices.service';
import { DeviceController } from './devices.controller';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
