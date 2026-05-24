import { Controller, Get } from '@nestjs/common';

@Controller('market')
export class MarketInsightsController {
  @Get('disruption-alerts')
  getDisruptionAlerts() {
    return {
      active: false,
      status: 'stable',
      message: 'No active supply-chain disruption alerts.',
      updatedAt: new Date().toISOString(),
    };
  }
}
