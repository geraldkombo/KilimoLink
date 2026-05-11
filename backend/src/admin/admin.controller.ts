import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/auth/roles.decorator';
import { RolesGuard } from '../common/auth/roles.guard';
import { CurrentUser, JwtUser } from '../common/auth/current-user.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Updated to match new Role enum
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('impact')
  getImpact() {
    return this.adminService.getImpactMetrics();
  }

  @Get('users')
  getUsers() {
    return this.adminService.listUsers();
  }

  @Get('products')
  getProducts() {
    return this.adminService.listProducts();
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('audit-logs')
  auditLogs(@CurrentUser() admin: JwtUser) {
    return this.adminService.listAuditLogs(admin.userId);
  }

  @Post('seed')
  seedData() {
    return this.adminService.seedDemoData();
  }
}
