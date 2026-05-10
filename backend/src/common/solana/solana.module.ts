import { Global, Module } from '@nestjs/common';
import { SolanaService } from './solana.service';
import { SquadsService } from './squads.service';

@Global()
@Module({
  providers: [SolanaService, SquadsService],
  exports: [SolanaService, SquadsService]
})
export class SolanaModule {}
