import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AnalitycsDto, GetAnalitycsRequestDto } from './dtos';
import { NotificationService } from 'src/notifications/notifications.service';
import { CreateEditMetricDto } from 'src/metrics/dtos';

@Injectable()
export class AnalitycsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  public async getAverageMetricsAnalitycs(
    animalId: number,
    req: GetAnalitycsRequestDto,
  ): Promise<AnalitycsDto> {
    const metrics = await this.prismaService.metric.findMany({
      select: {
        heartbeat: true,
        respirationRate: true,
        temperature: true,
        animal: {
          select: {
            species: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      where: {
        animalId,
        timestamp: {
          ...(req.endDate && { lte: req.endDate }),
          ...(req.startDate && { gte: req.startDate }),
        },
      },
    });

    const { status } = this.getStatus(metrics);
    const avgMetrics = metrics.reduce(
      (acc, metric) => {
        acc.avgHeartbeat += metric.heartbeat;
        acc.avgRespirationRate += metric.respirationRate;
        acc.avgTemperature += metric.temperature;
        return acc;
      },
      {
        avgHeartbeat: 0,
        avgRespirationRate: 0,
        avgTemperature: 0,
      },
    );

    avgMetrics.avgHeartbeat /= metrics.length;
    avgMetrics.avgRespirationRate /= metrics.length;
    avgMetrics.avgTemperature /= metrics.length;

    console.log(avgMetrics);
    console.log(metrics);

    return {
      id: animalId,
      heartbeat: avgMetrics.avgHeartbeat,
      respirationRate: avgMetrics.avgRespirationRate,
      temperature: avgMetrics.avgTemperature,
      status,
    };
  }

  public async getLastMetricsAnalytics(
    req: CreateEditMetricDto,
  ): Promise<{ status: string }> {
    const metrics = await this.prismaService.metric.findMany({
      select: {
        heartbeat: true,
        respirationRate: true,
        temperature: true,
        animal: {
          select: {
            id: true,
            name: true,
            species: true,
            userId: true,
          },
        },
      },
      take: 1,
      orderBy: { timestamp: 'desc' },
      where: {
        animalId: req.animalId,
      },
    });

    const animal = await this.prismaService.animal.findFirst({
      select: {
        id: true,
        name: true,
        species: true,
        userId: true,
      },
      where: {
        id: req.animalId,
      },
    });

    const status = this.getStatus([
      ...metrics,
      {
        ...req,
        animal,
      },
    ]);
    await this.sendNotification(
      status,
      {
        id: animal.id,
        name: animal.name,
      },
      animal.userId,
    );

    return {
      status: status.status,
    };
  }

  private getStatus(
    metrics: {
      heartbeat: number;
      respirationRate: number;
      temperature: number;
      animal?: {
        species: {
          id: number;
          name: string;
          description: string;
          minHeartbeat: number;
          maxHeartbeat: number;
          minRespirationRate: number;
          maxRespirationRate: number;
          minTemperature: number;
          maxTemperature: number;
        };
      };
    }[],
  ): { status: AnalitycsDto['status']; reasons: string[] } {
    if (metrics.length === 0) {
      return {
        status: 'fine',
        reasons: [],
      };
    }

    const firstMetric = metrics[0];
    const lastMetric = metrics[metrics.length - 1];

    const {
      maxHeartbeat,
      minHeartbeat,
      maxRespirationRate,
      minRespirationRate,
      maxTemperature,
      minTemperature,
    } = lastMetric.animal.species;

    const reasons: string[] = [];

    // Define coefficients for each metric
    const coeffs = {
      heartbeat: 0.4,
      respirationRate: 0.3,
      temperature: 0.3,
    };

    // Function to check thresholds and add reasons
    const checkThresholds = (
      metric: string,
      value: number,
      status: AnalitycsDto['status'],
      min: number,
      max: number,
    ) => {
      if (value > max) {
        reasons.push(
          status === 'critical'
            ? `${metric} is critically high: ${value} (expected below ${max})`
            : `${metric} is ${status} high: ${value}`,
        );
      } else if (value < min) {
        reasons.push(
          status === 'critical'
            ? `${metric} is critically low: ${value} (expected above ${min})`
            : `${metric} is ${status} low: ${value}`,
        );
      }
    };

    // Function to check all thresholds and add reasons
    const checkAllThresholds = (status: AnalitycsDto['status']) => {
      checkThresholds(
        'Heart rate',
        lastMetric.heartbeat,
        status,
        minHeartbeat,
        maxHeartbeat,
      );
      checkThresholds(
        'Respiration rate',
        lastMetric.respirationRate,
        status,
        minRespirationRate,
        maxRespirationRate,
      );
      checkThresholds(
        'Temperature',
        lastMetric.temperature,
        status,
        minTemperature,
        maxTemperature,
      );
    };

    // Calculate deviation percentage for a given metric
    const calculateDeviationPercentage = (
      value: number,
      min: number,
      max: number,
    ) => {
      if (value < min) {
        return (min - value) / min;
      } else if (value > max) {
        return (value - max) / max;
      } else {
        return 0;
      }
    };

    // Calculate the difference percentage between the first and last metrics
    const calculateDifferencePercentage = (initial: number, final: number) => {
      return Math.abs(final - initial) / initial;
    };

    // Calculate overall deviation score
    const calculateDeviationScore = () => {
      let score = 0;

      const heartbeatDeviation = calculateDeviationPercentage(
        lastMetric.heartbeat,
        minHeartbeat,
        maxHeartbeat,
      );
      const respirationDeviation = calculateDeviationPercentage(
        lastMetric.respirationRate,
        minRespirationRate,
        maxRespirationRate,
      );
      const temperatureDeviation = calculateDeviationPercentage(
        lastMetric.temperature,
        minTemperature,
        maxTemperature,
      );

      score += coeffs.heartbeat * Math.min(heartbeatDeviation, 1);
      score += coeffs.respirationRate * Math.min(respirationDeviation, 1);
      score += coeffs.temperature * Math.min(temperatureDeviation, 1);

      return score;
    };

    // Calculate the differences between the first and last metrics
    const heartbeatDifference = calculateDifferencePercentage(
      firstMetric.heartbeat,
      lastMetric.heartbeat,
    );
    const respirationDifference = calculateDifferencePercentage(
      firstMetric.respirationRate,
      lastMetric.respirationRate,
    );
    const temperatureDifference = calculateDifferencePercentage(
      firstMetric.temperature,
      lastMetric.temperature,
    );

    const overallDeviationScore = calculateDeviationScore();

    // Define thresholds for differences to consider them significant
    const significantDifferenceThreshold = 0.25;

    if (
      heartbeatDifference > significantDifferenceThreshold ||
      respirationDifference > significantDifferenceThreshold ||
      temperatureDifference > significantDifferenceThreshold
    ) {
      reasons.push(
        `Significant changes detected: Heartbeat difference ${heartbeatDifference.toFixed(
          2,
        )}, Respiration rate difference ${respirationDifference.toFixed(
          2,
        )}, Temperature difference ${temperatureDifference.toFixed(2)}`,
      );
      return { status: 'warning', reasons };
    }

    if (overallDeviationScore >= 1.0) {
      checkAllThresholds('critical');
      return { status: 'critical', reasons };
    }

    // Define thresholds for warning and ill statuses
    const warningThreshold = 0.5;
    const illThreshold = 0.75;

    if (overallDeviationScore >= illThreshold) {
      checkAllThresholds('ill');
      return { status: 'ill', reasons };
    }

    if (overallDeviationScore >= warningThreshold) {
      checkAllThresholds('warning');
      return { status: 'warning', reasons };
    }

    return { status: 'fine', reasons: [] };
  }

  private async sendNotification(
    { status, reasons }: { status: AnalitycsDto['status']; reasons: string[] },
    animal: {
      id: number;
      name: string;
    },
    userId: number,
  ) {
    let message;

    if (status === 'critical') {
      message = `${
        animal.name
      } appears to be in critical condition. Seek immediate veterinary care. Reasons: ${reasons?.join(
        ', ',
      )}`;
    }

    if (status === 'warning') {
      message = `We've noticed slight changes in ${
        animal.name
      } vital signs. Keep an eye on them and consult a veterinarian if they worsen. Reasons: ${reasons?.join(
        ', ',
      )}`;
    }

    if (status === 'ill') {
      message = `${
        animal.name
      } may be ill. We recommend contacting a veterinarian as soon as possible. Reasons: ${reasons?.join(
        ', ',
      )}`;
    }

    if (status !== 'fine') {
      this.notificationService.createNotification(
        {
          message,
          animalId: animal.id,
        },
        userId,
      );
    }
  }
}
