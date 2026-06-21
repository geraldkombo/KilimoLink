import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@CurrentUser() user: JwtUser, @Body() body: CreateOrderDto) {
    return this.ordersService.createOrder(user.userId, body);
  }

  @Patch(':id/complete')
  completeOrder(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.ordersService.completeOrder(user.userId, id);
  }

  @Get()
  getUserOrders(
    @CurrentUser() user: JwtUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.getUserOrders(
      user.userId,
      page ? Math.max(1, Number(page)) : 1,
      limit ? Math.min(100, Math.max(1, Number(limit))) : 20,
    );
  }
}
