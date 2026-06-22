import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('messages')
  createMessage(
    @Req() req: { user: { userId?: string; sub?: string } },
    @Body() dto: CreateMessageDto,
  ) {
    return this.chat.createMessage(req.user.userId ?? req.user.sub!, dto);
  }

  @Get('conversations')
  getConversations(@Req() req: { user: { userId?: string; sub?: string } }) {
    return this.chat.getConversations(req.user.userId ?? req.user.sub!);
  }

  @Get('messages/:userId')
  getThread(
    @Req() req: { user: { userId?: string; sub?: string } },
    @Param('userId') userId: string,
  ) {
    return this.chat.getThread(req.user.userId ?? req.user.sub!, userId);
  }

  @Patch('messages/:id/read')
  markRead(
    @Req() req: { user: { userId?: string; sub?: string } },
    @Param('id') id: string,
  ) {
    return this.chat.markRead(id, req.user.userId ?? req.user.sub!);
  }
}
