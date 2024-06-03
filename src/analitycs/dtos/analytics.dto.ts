export class AnalitycsDto {
  id: number;
  heartbeat: number;
  respirationRate: number;
  temperature: number;
  status: 'fine' | 'warning' | 'ill' | 'critical';
}
