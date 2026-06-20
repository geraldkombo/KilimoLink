import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest-price')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  suggestPrice(@Body() body: any) {
    return this.aiService.suggestPrice(body.productName, body.category, body.recentPrices || []);
  }

  @Get('price-truth/:slug')
  priceTruth(@Param('slug') slug: string) {
    const data = this.aiService.getPriceTruth(slug);
    if (!data) throw new NotFoundException('No reference price for this product');
    return data;
  }
}
