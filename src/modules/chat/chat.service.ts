import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { getPagingMeta } from '@/helpers/util';
import { FilterMessageDto, FilterRoomDto } from './dto/filter-message.dto';
import { CreateRoomDto, UpdateRoomDto } from './dto/create-room.dto';

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
    const [data, count] = await this.chatRepo.findMessage({
      roomId: Number(params.roomId),
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
      type: params.type
    });

    return {
      data,
      meta: getPagingMeta(count, params.page ?? 1, params.pageSize ?? 10),
    }
  }

  async findPrivateRoomBetweenUsers(userIds: number[]) {
    if (userIds?.length < 2) return;

    return this.chatRepo.findPrivateRoomBetweenUsers(userIds);
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const room = await this.chatRepo.createRoom(createRoomDto);

    return room;
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    const room = await this.chatRepo.updateRoom(updateRoomDto);

    return room;
  }


  async deleteRoom(roomId: number) {
    const room = await this.chatRepo.deleteRoom(roomId);
    return room;
  }
}