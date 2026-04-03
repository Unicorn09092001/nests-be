import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async findAll(filterData: FilterUserDto) {
    return await Promise.all([
      this.prisma.user.findMany({
        where: {
          id: filterData.id ? parseInt(filterData.id as unknown as string, 10) : undefined,
          email: filterData.email,
        },
        skip: (filterData.page - 1) * filterData.pageSize,
        take: Number(filterData.pageSize),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: {
          id: filterData.id ? parseInt(filterData.id as unknown as string, 10) : undefined,
          email: filterData.email,
        },
      }),
    ]) 
      
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(
    data: Partial<Omit<UpdateUserDto, 'id'>> & Pick<UpdateUserDto, 'id'>,
  ) {
    const { id, ...updateData } = data;
    return this.prisma.user.update({
      where: { id: parseInt(id as unknown as string, 10) },
      data: {
        ...updateData,
        roles: {
          set: updateData.roles?.map((roleId) => ({ id: roleId })) || [],
        }
      },
    });
  }

  async remove(id: string) { 
    return this.prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}
