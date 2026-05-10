import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class QueuesService {
  readonly smsQueue: Queue;
  readonly pushQueue: Queue;
  readonly deadlinesQueue: Queue;

  constructor() {
    if (process.env.DISABLE_QUEUES === 'true') {
      const noop = { add: async () => ({}) } as unknown as Queue;
      this.smsQueue = noop;
      this.pushQueue = noop;
      this.deadlinesQueue = noop;
      return;
    }

    const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: null
    });

    this.smsQueue = new Queue('sms', { connection });
    this.pushQueue = new Queue('push', { connection });
    this.deadlinesQueue = new Queue('deadlines', { connection });
  }
}
