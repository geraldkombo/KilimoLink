import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Market')
@Controller('market')
export class MarketAlertsController {
  @Get('disruption-alerts')
  @ApiOperation({ summary: 'Fetch real-time alerts based on NDMA drought phases and market disruptions' })
  getDisruptionAlerts() {
    // Stub: In a real implementation, this would fetch data from the NDMA API 
    // or a dedicated monitoring service.
    return [
      {
        id: 'alert-1',
        county: 'Turkana',
        phase: 'ALARM',
        indicator: 'High price volatility expected due to drought',
        recommendedAction: 'Increase grain storage; seek alternative water sources',
        createdAt: new Date(),
      },
      {
        id: 'alert-2',
        county: 'Marsabit',
        phase: 'ALERT',
        indicator: 'Declining livestock body conditions',
        recommendedAction: 'Consider early de-stocking or supplementary feeding',
        createdAt: new Date(),
      }
    ];
  }
}
