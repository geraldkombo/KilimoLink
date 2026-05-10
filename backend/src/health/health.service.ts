import { Injectable } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(private readonly health: HealthCheckService) {}

  check() {
    return this.health.check([]);
  }
}

