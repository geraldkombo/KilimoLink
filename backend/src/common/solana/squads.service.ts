import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey } from '@solana/web3.js';

@Injectable()
export class SquadsService implements OnModuleInit {
  private connection: Connection;
  private multisigProgramId: PublicKey;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL');
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    // Squads V4 Program ID
    this.multisigProgramId = new PublicKey('SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf');
  }

  /**
   * For the hackathon, we focus on the ability to track and display 
   * multisig-controlled agricultural funds.
   */
  async getMultisigInfo(multisigAddress: string) {
    try {
      const pubkey = new PublicKey(multisigAddress);
      const balance = await this.connection.getBalance(pubkey);
      
      return {
        address: multisigAddress,
        balanceSol: balance / 1e9,
        programId: this.multisigProgramId.toBase58(),
        explorerUrl: `https://explorer.solana.com/address/${multisigAddress}?cluster=devnet`
      };
    } catch (e) {
      return { error: 'Invalid multisig address' };
    }
  }
}
