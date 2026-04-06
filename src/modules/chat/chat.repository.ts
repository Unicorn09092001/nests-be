import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: SendMessageDto) {
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
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({
        where: filter,
      }),
    ])
  } 
}
