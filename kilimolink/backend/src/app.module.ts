import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { ImpactModule } from './impact/impact.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './common/notifications/notifications.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { HealthModule } from './health/health.module';
import { MarketModule } from './market/market.module';
import { OracleModule } from './oracle/oracle.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60
      }
    ]),
    TerminusModule,
    NotificationsModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    MarketModule,
    OracleModule,
    OrdersModule,
    ReviewsModule,
    AdminModule,
    AiModule,
    ImpactModule,
    SeedModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
