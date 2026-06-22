import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

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

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpChallenge.updateMany({
      where: { phone, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });

    await this.prisma.otpChallenge.create({
      data: { phone, codeHash, expiresAt },
    });

    return process.env.NODE_ENV === 'development'
      ? { ok: true, devCode: code }
      : { ok: true };
  }

  async verifyOtp(phone: string, code: string) {
    await this.assertNotLocked(phone);

    const now = new Date();

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: {
        phone,
        usedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge) {
      await this.recordOtpFailure(phone);
      throw new UnauthorizedException('Code expired');
    }

    const valid = await bcrypt.compare(code, challenge.codeHash);

    if (!valid) {
      await this.recordOtpFailure(phone);
      throw new UnauthorizedException('Invalid code');
    }

    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { usedAt: now },
    });

    await this.prisma.otpVerifyThrottle.deleteMany({ where: { phone } });

    const email = `${phone}@sms.kilimolink`;

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: phone, role: Role.FARMER },
    });

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }

  async register(email: string, password: string, name?: string, role?: Role) {
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name: name ?? email,
        role: role ?? Role.FARMER,
        passwordHash,
      },
    });

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Password login not available for this account',
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Wrong password');
    }

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { token, user };
  }

  private async assertNotLocked(phone: string) {
    const throttle = await this.prisma.otpVerifyThrottle.findUnique({
      where: { phone },
    });

    if (throttle?.lockedUntil && throttle.lockedUntil > new Date()) {
      throw new HttpException('Too many attempts', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private async recordOtpFailure(phone: string) {
    const existing = await this.prisma.otpVerifyThrottle.findUnique({
      where: { phone },
    });

    const failures = (existing?.failures ?? 0) + 1;
    const lockedUntil =
      failures >= 3 ? new Date(Date.now() + 10 * 60 * 1000) : null;

    await this.prisma.otpVerifyThrottle.upsert({
      where: { phone },
      update: { failures, lockedUntil },
      create: { phone, failures, lockedUntil },
    });

    if (failures >= 3) {
      throw new HttpException('Too many attempts', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
