import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async loginWithEmail(email: string, name: string, role: Role = Role.FARMER) {
    // Automatically grant ADMIN role to the user's specific email
    const finalRole = (email === 'kombo@protonmail.com' || email === 'kilimolink@proton.me') ? Role.ADMIN : role;

    const user = await this.prisma.user.upsert({
      where: { email },
      update: { name, role: finalRole },
      create: { 
        email, 
        name, 
        role: finalRole
      }
    });

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }

  // Stub for existing OTP logic if needed by other modules
  async sendOtp(phone: string) {
    return { ok: true, devCode: '123456' };
  }

  async verifyOtp(phone: string, code: string) {
    const user = await this.prisma.user.upsert({
      where: { email: `${phone}@kilimolink.com` }, // Mock email from phone
      update: {},
      create: { 
        email: `${phone}@kilimolink.com`, 
        name: `User ${phone}`, 
        phone 
      }
    });

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token };
  }
}
