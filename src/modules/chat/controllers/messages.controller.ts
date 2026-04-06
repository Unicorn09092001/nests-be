import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from '../chat.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly chatService: ChatService) {}
  
  @Get()
  findAll(
    @Query('roomId') roomId: number,
    @Query('current') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.chatService.getMessages({roomId, page, pageSize});
  }
}
