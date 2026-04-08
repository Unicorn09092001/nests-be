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
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async updateMessage(message: UpdateMessageDto) {
    return this.prisma.message.update({
      where: { id: message.id },
      data: {
        content: message.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async findMessage(data: FilterMessageDto) {
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
      },
      type: data.type ?? undefined
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

  async findPrivateRoomBetweenUsers(userIds: number[]) {
    return this.prisma.room.findFirst({
      where: {
        type: 'PRIVATE',
        users: {
          every: {
            id: {
              in: userIds
            }
          }
        },
        AND: [
          {
            users: {
              some: {
                id: userIds[0]
              }
            }
          },
          {
            users: {
              some: {
                id: userIds[1]
              }
            }
          }
        ]
      },
    })
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const { users, ...roomData } = createRoomDto;
    return this.prisma.room.create({
      data: {
        name: roomData.name,
        createdById: roomData.createdById,
        type: roomData.type,
        users: {
          connect: [...users.map(id => ({ id })), { id: roomData.createdById }],
        }
      },
    });
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    const { id, name, users, type } = updateRoomDto;
    return this.prisma.room.update({
      where: { id },
      data: {
        name,
        ...(type && { type }),
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
