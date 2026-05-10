import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentsService } from '../common/documents/documents.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService, private readonly documents: DocumentsService) {}

  async listAuditLogs(adminId: string) {
    return this.prisma.auditLog.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
