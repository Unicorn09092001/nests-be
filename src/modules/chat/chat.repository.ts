import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FilterMessageDto, FilterRoomDto } from './dto/filter-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: SendMessageDto) {
    return this.prisma.message.create({
      data,
    });
  }

  async save(message: UpdateMessageDto) {
    return this.prisma.message.update({
      where: { id: message.id },
      data: {
        content: message.content,
      },
    });
  }

  async find(data: FilterMessageDto) {
    const filter = {
      roomId: data.roomId,
    }

    return Promise.all([
      this.prisma.message.findMany({
        where: filter,
        skip: (data.page - 1) * data.pageSize,
        take: Number(data.pageSize),
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({
        where: filter,
      }),
    ])
  }

  async findRooms(data: FilterRoomDto) {
    const filter = {
      createdById: Number(data.createdById) || undefined,
    }

    return Promise.all([
      this.prisma.room.findMany({
        where: filter,
        skip: (data.page - 1) * data.pageSize,
        take: Number(data.pageSize),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.room.count({
        where: filter,
      }),
    ])
  } 

  async createRoom(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        ...createRoomDto,
        users: {
          connect: createRoomDto.users.map(id => ({ id })),
        }
      },
    });
  }
}
