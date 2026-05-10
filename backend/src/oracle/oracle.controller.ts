import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VerificationService } from '../common/verification/verification.service';

@ApiTags('Oracle')
@Controller('oracle')
export class OracleController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('prices')
  @ApiOperation({ summary: 'Fetch verified statistical price data for a product in a region' })
  @ApiQuery({ name: 'product', required: true, description: 'The crop or product name (e.g., Maize, Tomatoes)' })
  @ApiQuery({ name: 'region', required: true, description: 'The county or region name (e.g., Nakuru, Kiambu)' })
  getVerifiedPrice(
    @Query('product') product: string,
    @Query('region') region: string,
  ) {
    // Reusing the verification service's logic but exposing it as a public oracle endpoint
    return this.verificationService.validatePrice(region, product, 0); // Price 0 to just get the baseline
  }
}
