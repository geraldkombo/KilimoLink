import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-email')
  loginEmail(@Body() body: { email: string; name: string; role?: any }) {
    return this.authService.loginWithEmail(body.email, body.name, body.role);
  }

  @Post('otp')
  sendOtp(@Body() dto: any) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('verify')
  verifyOtp(@Body() dto: any) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }
}
