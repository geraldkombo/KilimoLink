import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueuesService } from '../queues/queues.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly queues: QueuesService
  ) {}

  async sendOtp(phone: string) {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const count = await this.prisma.otpChallenge.count({ where: { phone, createdAt: { gt: since } } });
    if (count >= 5) {
      throw new HttpException('OTP limit reached', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpChallenge.create({
      data: {
        phone,
        codeHash,
        expiresAt
      }
    });

    await this.queues.smsQueue.add('sendOtp', { phone, template: 'OTP', code });

    return { ok: true, devCode: process.env.DEV_OTP_ECHO === 'true' ? code : undefined };
  }

  async verifyOtp(phone: string, code: string) {
    const throttle = await this.prisma.otpVerifyThrottle.findUnique({ where: { phone } });
    if (throttle?.lockedUntil && throttle.lockedUntil > new Date()) {
      throw new HttpException('Too many attempts', HttpStatus.TOO_MANY_REQUESTS);
    }

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { phone, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });
    if (!challenge) {
      throw new UnauthorizedException('OTP expired');
    }
    const ok = await bcrypt.compare(code, challenge.codeHash);
    if (!ok) {
      const updated = await this.prisma.otpVerifyThrottle.upsert({
        where: { phone },
        update: { failures: { increment: 1 } },
        create: { phone, failures: 1 }
      });
      if (updated.failures >= 5) {
        await this.prisma.otpVerifyThrottle.update({
          where: { phone },
          data: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000) }
        });
      }
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone }
    });
    if (user.deletedAt) {
      throw new UnauthorizedException('Account deleted');
    }
    await this.prisma.otpVerifyThrottle.delete({ where: { phone } }).catch(() => undefined);
    await this.prisma.otpChallenge.update({ where: { id: challenge.id }, data: { userId: user.id } });

    const token = await this.jwt.signAsync({ sub: user.id, role: 'user' });
    return { token };
  }
}
