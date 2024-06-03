import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class DeviceService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getDevice(id: number): Promise<{
    id: number;
    sharedSecret: string;
    animalId: number;
  }> {
    const cacheDevice = await this.cacheManager.get<{
      id: number;
      sharedSecret: string;
      animalId: number;
    }>(`device${id}`);

    if (cacheDevice) {
      console.log('cacheDevice with cache', cacheDevice);
      return cacheDevice;
    }

    console.log('cacheDevice without cache', cacheDevice);

    const device = await this.prismaService.device.findFirst({
      select: {
        id: true,
        animalId: true,
        sharedSecret: true,
      },
      where: {
        id,
      },
    });

    await this.cacheManager.set(`device${id}`, device, 1000 * 60 * 60);

    return device;
  }

  public async createDevice(animalId: number): Promise<{
    id: number;
    sharedSecret: string;
    maxHeartbeat: number;
    minHeartbeat: number;
    maxRespirationRate: number;
    minRespirationRate: number;
    maxTemperature: number;
    minTemperature: number;
  }> {
    const salt = await bcrypt.genSalt(1);

    const randomSharedSecret = await crypto.randomBytes(48).toString('hex');

    const hashedSharedSecret = await bcrypt.hash(randomSharedSecret, salt);

    const device = await this.prismaService.device.create({
      data: {
        sharedSecret: hashedSharedSecret,
        animalId,
      },
      select: {
        id: true,
        sharedSecret: true,
        animal: {
          select: {
            species: {
              select: {
                minHeartbeat: true,
                maxHeartbeat: true,
                minRespirationRate: true,
                maxRespirationRate: true,
                minTemperature: true,
                maxTemperature: true,
              },
            },
          },
        },
      },
    });

    return {
      id: device.id,
      sharedSecret: device.sharedSecret,
      minHeartbeat: device.animal.species.minHeartbeat,
      maxHeartbeat: device.animal.species.maxHeartbeat,
      minRespirationRate: device.animal.species.minRespirationRate,
      maxRespirationRate: device.animal.species.maxRespirationRate,
      minTemperature: device.animal.species.minTemperature,
      maxTemperature: device.animal.species.maxTemperature,
    };
  }

  public async editDevice(
    deviceId: number,
    animalId: number,
  ): Promise<{ id: number }> {
    const device = await this.prismaService.device.update({
      data: {
        animalId,
      },
      where: {
        id: deviceId,
      },
      select: {
        id: true,
      },
    });

    return {
      id: device.id,
    };
  }

  public async deleteDevice(id: number): Promise<void> {
    await this.prismaService.metric.delete({
      where: {
        id,
      },
    });
  }
}
