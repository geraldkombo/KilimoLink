import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { resolveJwtSecret } from '../common/jwt.secret';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    JwtModule.register({
      secret: resolveJwtSecret(),
      signOptions: { expiresIn: '7d' }
    })
  ],
  controllers: [AdminAuthController, AdminController],
  providers: [AdminAuthService, AdminService]
})
export class AdminModule {}
