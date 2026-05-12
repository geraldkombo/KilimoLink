import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

  @Get()
  getUserOrders(@CurrentUser() user: JwtUser) {
    return this.ordersService.getUserOrders(user.userId);
  }
}
