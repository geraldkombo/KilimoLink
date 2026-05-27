import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private isAvailable = false;
  private loggedConnectionIssue = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    if (process.env.DISABLE_REDIS === 'true') {
      this.isAvailable = false;
      return;
    }
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    });

    this.client.on('ready', () => {
      this.isAvailable = true;
      this.loggedConnectionIssue = false;
    });

    this.client.on('error', () => {
      this.isAvailable = false;
      if (!this.loggedConnectionIssue) {
        this.loggedConnectionIssue = true;
        console.warn('Redis unavailable, continuing without cache');
      }
    });

    try {
      await this.client.connect();
    } catch {
      this.isAvailable = false;
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch {
      this.isAvailable = false;
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
    if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
        await this.client.set(key, value);
      }
    } catch {
      this.isAvailable = false;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      await this.client.del(key);
    } catch {
      this.isAvailable = false;
    }
  }
}
