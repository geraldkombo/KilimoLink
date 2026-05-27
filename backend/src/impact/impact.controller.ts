import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImpactService } from './impact.service';

@ApiTags('impact')
@Controller('impact')
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Get()
  getImpact() {
    return this.impactService.getMetrics();
  }
}
