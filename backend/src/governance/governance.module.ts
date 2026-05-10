import { Module } from '@nestjs/common';
import { GovernanceController } from './governance.controller';
import { GovernanceService } from './governance.service';
import { SolanaModule } from '../common/solana/solana.module';

@Module({
  imports: [SolanaModule],
  controllers: [GovernanceController],
  providers: [GovernanceService],
})
export class GovernanceModule {}
