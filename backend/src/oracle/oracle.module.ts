import { Module } from '@nestjs/common';
import { OracleController } from './oracle.controller';

@Module({
  controllers: [OracleController],
})
export class OracleModule {}
