import { Module } from '@nestjs/common';
import { AnalitycsService } from './analitycs.service';
import { AnalitycsController } from './analitycs.controller';
import { NotificationModule } from 'src/notifications';

@Module({
  imports: [NotificationModule],
  controllers: [AnalitycsController],
  providers: [AnalitycsService],
  exports: [AnalitycsService],
})
export class AnalitycsModule {}
