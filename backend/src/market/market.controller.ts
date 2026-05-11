import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';

@ApiTags('market')
@Controller('products')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createProduct(@CurrentUser() user: JwtUser, @Body() body: any) {
    return this.marketService.createProduct(user.userId, body);
  }

  @Get()
  listProducts(@Query('lat') lat?: string, @Query('lng') lng?: string) {
    return this.marketService.listProducts(lat ? Number(lat) : undefined, lng ? Number(lng) : undefined);
  }
}
