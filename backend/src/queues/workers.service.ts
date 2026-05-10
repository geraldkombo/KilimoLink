import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationTransportService } from '../common/notifications/notification-transport.service';

@Injectable()
export class WorkersService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService, private readonly transport: NotificationTransportService) {}

  onModuleInit() {
    if (process.env.ENABLE_WORKERS !== 'true') return;

    const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });

    new Worker(
      'sms',
      async (job) => {
        if (job.name === 'sendOtp') {
          const { phone, code } = job.data as { phone: string; code: string };
          const res = await this.transport.sendSms(phone, `Your KilimoLink verification code is ${code}`);
          await this.prisma.notificationLog.create({
            data: {
              phone,
              channel: 'SMS',
              template: 'OTP',
              payload: {},
              status: res.ok ? 'SENT' : 'FAILED',
              error: res.ok ? null : res.error || 'unknown'
            }
          });
          if (!res.ok) throw new Error(res.error || 'sms_failed');
          return;
        }
      },
      { connection }
    );
  }
}
