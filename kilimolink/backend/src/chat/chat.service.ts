import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  createMessage(senderId: string, dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId: dto.receiverId,
        orderId: dto.orderId,
        text: dto.text,
      },
      include: this.messageIncludes(),
    });
  }

  async getConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: this.messageIncludes(),
    });

    const grouped = new Map<string, any>();

    for (const message of messages) {
      const isSender = message.senderId === userId;
      const partner = isSender ? message.receiver : message.sender;
      const existing = grouped.get(partner.id);

      if (!existing) {
        grouped.set(partner.id, {
          partner: { id: partner.id, name: partner.name },
          lastMessage: { text: message.text, createdAt: message.createdAt },
          unreadCount: 0,
        });
      }

      if (message.receiverId === userId && !message.readAt) {
        grouped.get(partner.id).unreadCount += 1;
      }
    }

    return Array.from(grouped.values());
  }

  async getThread(userId: string, otherUserId: string) {
    await this.prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: this.messageIncludes(),
    });
  }

  async markRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId, receiverId: userId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
      include: this.messageIncludes(),
    });
  }

  private messageIncludes() {
    return {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    };
  }
}
