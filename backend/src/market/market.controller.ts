import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('market')
@Controller()
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post('products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createProduct(@CurrentUser() user: JwtUser, @Body() body: CreateProductDto) {
    return this.marketService.createProduct(user.userId, body);
  }

  @Get('products')
  listProducts(@Query() query: Record<string, string>) {
    return this.marketService.listProducts(query);
  }

  @Post('orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  placeOrder(@CurrentUser() user: JwtUser, @Body() body: PlaceOrderDto) {
    return this.marketService.placeOrder(user.userId, body);
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.marketService.getOrder(id);
  }

  @Patch('orders/:id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() body: { status: string }) {
    return this.marketService.updateOrderStatus(user.userId, id, body.status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('products/:id')
  updateProduct(@CurrentUser() user: JwtUser, @Param('id') productId: string, @Body() body: UpdateProductDto) {
    return this.marketService.updateProduct(user.userId, productId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('products/:id')
  deleteProduct(@CurrentUser() user: JwtUser, @Param('id') productId: string) {
    return this.marketService.deleteProduct(user.userId, productId);
  }

  @Get('products/:id/reviews')
  listReviews(@Param('id') productId: string) {
    return this.marketService.listReviews(productId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('products/:id/reviews')
  createReview(@CurrentUser() user: JwtUser, @Param('id') productId: string, @Body() body: CreateReviewDto) {
    return this.marketService.createReview(user.userId, productId, body.rating, body.comment);
  }
}
