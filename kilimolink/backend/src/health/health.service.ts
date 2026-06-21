import { Injectable } from '@nestjs/common';
import { HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  async check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => {
        let dbOk = false;
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          dbOk = true;
        } catch {
          dbOk = false;
        }
        return {
          database: {
            status: dbOk ? 'up' : 'down',
          },
        };
      },
    ]);
  }
}

