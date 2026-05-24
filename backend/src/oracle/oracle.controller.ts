import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OracleService } from './oracle.service';

@ApiTags('oracle')
@Controller('oracle')
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @Get('prices')
  getPrices(@Query('product') product?: string) {
    return this.oracleService.getPriceSnapshot(product);
  }
}
