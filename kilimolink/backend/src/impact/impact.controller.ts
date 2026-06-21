import { Controller, Get } from '@nestjs/common';
import { ImpactService } from './impact.service';

@Controller('impact')
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Get()
  getMetrics() {
    return this.impactService.getMetrics();
  }
}
