import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
