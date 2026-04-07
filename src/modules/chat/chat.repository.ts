import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FilterMessageDto, FilterRoomDto } from './dto/filter-message.dto';
import { CreateRoomDto, UpdateRoomDto } from './dto/create-room.dto';

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
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      this.prisma.message.count({
        where: filter,
      }),
    ])
  }

  async findRooms(data: FilterRoomDto) {
    const filter = {
      users: {
        some: {
          id: Number(data.createdById)
        }
      }
    }

    return Promise.all([
      this.prisma.room.findMany({
        where: filter,
        skip: (data.page - 1) * data.pageSize,
        take: Number(data.pageSize),
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }
        }
      }),
      this.prisma.room.count({
        where: filter,
      }),
    ])
  } 

  async createRoom(createRoomDto: CreateRoomDto) {
    const { users, ...roomData } = createRoomDto;
    return this.prisma.room.create({
      data: {
        ...roomData,
        users: {
          connect: [...users.map(id => ({ id })), { id: roomData.createdById }],
        }
      },
    });
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    const { id, name, users } = updateRoomDto;
    return this.prisma.room.update({
      where: { id },
      data: {
        name,
        users: {
          set: users?.map((id) => ({ id })) || [],
        },
      },
    });
  }

  async deleteRoom(roomId: number) {
    return this.prisma.room.delete({
      where: { id: roomId },
    });
  }
}
