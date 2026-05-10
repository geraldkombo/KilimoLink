import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { CryptoService } from '../common/crypto/crypto.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly crypto: CryptoService
  ) {}

  private isStrongPassword(password: string) {
    if (password.length < 12) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    return true;
  }

  async login(email: string, password: string, totp?: string, ip?: string) {
    const throttle = await this.prisma.adminLoginThrottle.findFirst({
      where: { adminEmail: email, ip: ip || null },
      orderBy: { updatedAt: 'desc' }
    });
    if (throttle?.lockedUntil && throttle.lockedUntil > new Date()) {
      throw new HttpException('Too many attempts', HttpStatus.TOO_MANY_REQUESTS);
    }

    const admin = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    if (!this.isStrongPassword(password)) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      const updated = await this.prisma.adminLoginThrottle.create({
        data: { adminEmail: email, ip: ip || null, adminId: admin.id, failures: (throttle?.failures || 0) + 1 }
      });
      if (updated.failures >= 5) {
        await this.prisma.adminLoginThrottle.create({
          data: {
            adminEmail: email,
            ip: ip || null,
            adminId: admin.id,
            failures: updated.failures,
            lockedUntil: new Date(Date.now() + 15 * 60 * 1000)
          }
        });
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.totpSecretEnc) {
      const secret = speakeasy.generateSecret({ name: `KilimoLink Admin (${email})` });
      await this.prisma.adminUser.update({
        where: { id: admin.id },
        data: { totpSecretEnc: this.crypto.encryptString(secret.base32) }
      });
      const token = await this.jwt.signAsync({ sub: admin.id, role: admin.role });
      await this.prisma.adminLoginThrottle.deleteMany({ where: { adminEmail: email } });
      return { token, mfaSetup: { secretBase32: secret.base32, otpauthUrl: secret.otpauth_url } };
    }

    if (!totp) throw new ForbiddenException('TOTP required');
    const base32 = this.crypto.decryptString(admin.totpSecretEnc);
    const verified = speakeasy.totp.verify({ secret: base32, encoding: 'base32', token: totp, window: 1 });
    if (!verified) throw new UnauthorizedException('Invalid TOTP');

    const token = await this.jwt.signAsync({ sub: admin.id, role: admin.role });
    await this.prisma.adminLoginThrottle.deleteMany({ where: { adminEmail: email } });
    return { token };
  }
}
