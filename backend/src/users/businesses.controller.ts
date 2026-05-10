import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { UpsertBusinessDto } from './dto/upsert-business.dto';
import { UsersService } from './users.service';

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  upsert(@CurrentUser() user: JwtUser, @Body() dto: UpsertBusinessDto) {
    return this.usersService.upsertBusiness(user.userId, dto);
  }

  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.usersService.getMyBusiness(user.userId);
  }
}

