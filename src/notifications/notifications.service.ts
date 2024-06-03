import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { NotificationDto, CreateEditNotificationDto } from './dtos';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getNotifications(userId: number): Promise<NotificationDto[]> {
    const notifications = await this.prismaService.notification.findMany({
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
      take: 10,
      where: {
        userId,
      },
    });

    return notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
    }));
  }

  public async createNotification(
    req: CreateEditNotificationDto,
    userId: number,
  ): Promise<{ id: number }> {
    const notification = await this.prismaService.notification.create({
      data: {
        message: req.message,
        animalId: req.animalId,
        userId,
      },
      select: {
        id: true,
      },
    });

    return {
      id: notification.id,
    };
  }
}
