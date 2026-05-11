import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private isStrongPassword(password: string) {
    return password.length >= 8; // Simplified for hackathon
  }

  async login(email: string, password: string, ip?: string) {
    const throttle = await this.prisma.adminLoginThrottle.findFirst({
      where: { adminEmail: email },
      orderBy: { updatedAt: 'desc' }
    });
    if (throttle?.lockedUntil && throttle.lockedUntil > new Date()) {
      throw new HttpException('Too many attempts', HttpStatus.TOO_MANY_REQUESTS);
    }

    const admin = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      // Simple throttle update
      await this.prisma.adminLoginThrottle.create({
        data: { adminEmail: email, adminId: admin.id, failures: (throttle?.failures || 0) + 1 }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwt.signAsync({ sub: admin.id, role: admin.role });
    await this.prisma.adminLoginThrottle.deleteMany({ where: { adminEmail: email } });
    return { token };
  }
}
