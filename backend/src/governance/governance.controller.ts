import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { GovernanceService } from './governance.service';

@ApiTags('Governance')
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post('proposals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a cooperative fund proposal' })
  createProposal(@Body() body: { multisigAddress: string; title: string; description: string }) {
    return this.governanceService.createProposal(body.multisigAddress, body.title, body.description);
  }

  @Get('proposals/:id/votes')
  @ApiOperation({ summary: 'Track on-chain multisig/DAO votes for a proposal' })
  getProposalVotes(@Param('id') id: string) {
    return this.governanceService.getProposalVotes(id);
  }
}
