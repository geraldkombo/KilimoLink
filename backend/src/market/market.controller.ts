import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('market')
@Controller('products')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createProduct(@CurrentUser() user: JwtUser, @Body() body: CreateProductDto) {
    return this.marketService.createProduct(user.userId, body);
  }

  @Get()
  listProducts(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.marketService.listProducts(
      lat ? Number(lat) : undefined,
      lng ? Number(lng) : undefined,
      page ? Math.max(1, Number(page)) : 1,
      limit ? Math.min(100, Math.max(1, Number(limit))) : 50,
    );
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMyProducts(@CurrentUser() user: JwtUser) {
    return this.marketService.getMyProducts(user.userId);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.marketService.getProductById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateProduct(@Param('id') id: string, @CurrentUser() user: JwtUser, @Body() body: UpdateProductDto) {
    return this.marketService.updateProduct(id, user.userId, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.marketService.deleteProduct(id, user.userId);
  }
}
