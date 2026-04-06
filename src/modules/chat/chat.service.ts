import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageRepo: ChatRepository,
  ) {}

  async createMessage(data: SendMessageDto) {
    const message = await this.messageRepo.create(data);
    return this.messageRepo.save({
      id: message.id,
      content: message.content,
    });
  }

  async getMessages(roomId: string) {
    return this.messageRepo.find({
      roomId,
      page: 1,
      pageSize: 20,
    });
  }
}