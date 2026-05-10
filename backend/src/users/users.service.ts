import { ForbiddenException, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpsertBusinessDto } from './dto/upsert-business.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        consentSms: true,
        consentPush: true,
        consentAt: true,
        deletedAt: true,
        createdAt: true
      }
    });
  }

  updateConsent(userId: string, consentSms: boolean, consentPush: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        consentSms,
        consentPush,
        consentAt: new Date()
      },
      select: { id: true, consentSms: true, consentPush: true, consentAt: true }
    });
  }

  async deleteMe(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.deletedAt) throw new ForbiddenException('Already deleted');

    const anon = `deleted_${randomBytes(8).toString('hex')}`;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phone: anon,
        consentSms: false,
        consentPush: false,
        consentAt: null,
        deletedAt: new Date()
      }
    });

    return { ok: true };
  }

  getMyBusiness(userId: string) {
    return this.prisma.business.findUnique({ where: { userId } });
  }

  upsertBusiness(userId: string, dto: UpsertBusinessDto) {
    return this.prisma.business.upsert({
      where: { userId },
      update: {
        youthLed: dto.youthLed,
        womenLed: dto.womenLed,
        businessType: dto.businessType,
        sector: dto.sector,
        county: dto.county,
        businessSize: dto.businessSize,
        agpoCertificate: dto.agpoCertificate ?? null
      },
      create: {
        userId,
        youthLed: dto.youthLed,
        womenLed: dto.womenLed,
        businessType: dto.businessType,
        sector: dto.sector,
        county: dto.county,
        businessSize: dto.businessSize,
        agpoCertificate: dto.agpoCertificate ?? null
      }
    });
  }
}
