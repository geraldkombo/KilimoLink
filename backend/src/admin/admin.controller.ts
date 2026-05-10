import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SquadsService } from '../common/solana/squads.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/auth/roles.decorator';
import { RolesGuard } from '../common/auth/roles.guard';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'COUNTY_ADMIN', 'SUPPORT')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly squads: SquadsService) {}

  @Get('audit-logs')
  auditLogs(@CurrentUser() admin: JwtUser) {
    return this.adminService.listAuditLogs(admin.userId);
  }

  @Get('treasury-info')
  treasuryInfo(@Query('address') address: string) {
    return this.squads.getMultisigInfo(address);
  }
}
