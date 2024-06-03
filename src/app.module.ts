import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';
import { UserModule } from './users';
import { JwtModule } from '@nestjs/jwt';
import { AnimalModule } from './animals';
import { AnimalSpeciesModule } from './animals-species';
import { NotificationModule } from './notifications';
import { MetricModule } from './metrics';
import { AnalitycsModule } from './analitycs';
import { DeviceModule } from './devices';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AnalitycsModule,
    AnimalModule,
    AnimalSpeciesModule,
    AuthModule,
    DeviceModule,
    MetricModule,
    NotificationModule,
    UserModule,
    PrismaModule,
  ],
})
export class AppModule {}
