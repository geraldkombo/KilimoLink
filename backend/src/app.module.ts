import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './common/crypto/crypto.module';
import { DocumentsModule } from './common/documents/documents.module';
import { NotificationsModule } from './common/notifications/notifications.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { SolanaModule } from './common/solana/solana.module';
import { VerificationModule } from './common/verification/verification.module';
import { HealthModule } from './health/health.module';
import { MarketModule } from './market/market.module';
import { QueuesModule } from './queues/queues.module';
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
    CryptoModule,
    DocumentsModule,
    NotificationsModule,
    PrismaModule,
    SolanaModule,
    VerificationModule,
    QueuesModule,
    AuthModule,
    UsersModule,
    MarketModule,
    AdminModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
