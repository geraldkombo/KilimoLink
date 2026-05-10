import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.usersService.getMe(user.userId);
  }

  @Post('me/consent')
  updateConsent(@CurrentUser() user: JwtUser, @Body() dto: UpdateConsentDto) {
    return this.usersService.updateConsent(user.userId, dto.consentSms, dto.consentPush);
  }

  @Delete('me')
  deleteMe(@CurrentUser() user: JwtUser) {
    return this.usersService.deleteMe(user.userId);
  }
}
