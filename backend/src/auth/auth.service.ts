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
    const adminEmails = ['kombo@protonmail.com', 'kilimolink@proton.me'];
    const isWhitelistedAdmin = adminEmails.includes(email);

    const existing = await this.prisma.user.findUnique({ where: { email } });

    let user;
    if (existing) {
      user = await this.prisma.user.update({
        where: { email },
        data: {
          name,
          role: isWhitelistedAdmin ? Role.ADMIN : (role ?? existing.role),
        },
      });
    } else {
      const finalRole = isWhitelistedAdmin ? Role.ADMIN : role;
      user = await this.prisma.user.create({
        data: { email, name, role: finalRole },
      });
    }

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }

  // Stub for existing OTP logic if needed by other modules
  async sendOtp(phone: string) {
    return { ok: true, devCode: '123456' };
  }

  async verifyOtp(phone: string, code: string) {
    const user = await this.prisma.user.upsert({
      where: { email: `${phone}@kilimolink.demo` }, // Mock email from phone
      update: {},
      create: { 
        email: `${phone}@kilimolink.demo`, 
        name: `User ${phone}`, 
        phone 
      }
    });

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token };
  }
}
