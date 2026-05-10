import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

@Injectable()
export class SolanaService implements OnModuleInit {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL');
    const wssUrl = this.configService.get<string>('SOLANA_WSS_URL');

    this.connection = new Connection(rpcUrl, {
      wsEndpoint: wssUrl,
      commitment: 'confirmed'
    });

    this.logger.log(`Solana connection initialized to: ${rpcUrl}`);
  }

  async getBalance(address: string): Promise<number> {
    const pubkey = new PublicKey(address);
    const balance = await this.connection.getBalance(pubkey);
    return balance / 1e9; // Convert lamports to SOL
  }

  getConnection(): Connection {
    return this.connection;
  }
}
