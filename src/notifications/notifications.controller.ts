import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { AuthGuard } from 'src/auth';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getNotifications(@Req() req): Promise<NotificationDto[]> {
    return await this.notificationService.getNotifications(req.user.sub);
  }
}
