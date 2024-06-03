export class MetricDto {
  id: number;
  heartbeat: number;
  respirationRate: number;
  temperature: number;
  timestamp: string;
  animal: {
    id: number;
    name: string;
  };
}
