import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @HttpCode(200)
  async seed(@Query('key') key: string) {
    if (key !== 'seedme-2024') {
      return { error: 'invalid key' };
    }
    const result = await this.seedService.run();
    return { ok: true, products: result };
  }
}
