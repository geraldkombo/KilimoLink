import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketAlertsController } from './market-alerts.controller';
import { MarketService } from './market.service';

@Module({
  controllers: [MarketController, MarketAlertsController],
  providers: [MarketService]
})
export class MarketModule {}

