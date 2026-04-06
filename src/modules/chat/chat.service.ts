import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { getPagingMeta } from '@/helpers/util';
import { FilterMessageDto, FilterRoomDto } from './dto/filter-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
  ) {}

  async createMessage(data: SendMessageDto) {
    const message = await this.chatRepo.createMessage(data);
    // return this.messageRepo.save({
    //   id: message.id,
    //   content: message.content,
    // });
    return message;
  }

  async getMessages(params: FilterMessageDto) {
    const [data, count] = await this.chatRepo.find({
      roomId: params.roomId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
    });

    return {
      data,
      meta: getPagingMeta(count, params.page ?? 1, params.pageSize ?? 10),
    }
  }

  async getRooms(params: FilterRoomDto) {
    const [data, count] = await this.chatRepo.findRooms({
      createdById: params.createdById,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
    });

    return {
      data,
      meta: getPagingMeta(count, params.page ?? 1, params.pageSize ?? 10),
    }
  }

  createRoom(createRoomDto: CreateRoomDto) {
    const room = this.chatRepo.createRoom(createRoomDto);

    return room;
  }

  async updateRoom() {
    return 'update room';
  }
}