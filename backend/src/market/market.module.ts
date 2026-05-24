import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketInsightsController } from './market-insights.controller';
import { MarketService } from './market.service';

@Module({
  controllers: [MarketController, MarketInsightsController],
  providers: [MarketService]
})
export class MarketModule {}
