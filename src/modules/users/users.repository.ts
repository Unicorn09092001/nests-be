import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateProfileDto, CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/user.dto';

export const USERS_RESPONSE_SELECT = {
  id: true,
  email: true,
  profile: {
    select: {
      name: true,
      address: true,
      avatar: true,
      phone: true,
    },
  },
};

export const USER_RESPONSE_SELECT = {
  profile: {
    select: {
      name: true,
      address: true,
      avatar: true,
      phone: true,
    },
  },
  roles: {
    include: {
      permissions: true,
    },
  },
}
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      // include: USER_RESPONSE_SELECT
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: USER_RESPONSE_SELECT
    });
  }

  async findAll(filterData: FilterUserDto) {
    const filter = {
      id: filterData.id ?? undefined,
      email: filterData.email,
    }

    return await Promise.all([
      this.prisma.user.findMany({
        where: filter,
        select: USERS_RESPONSE_SELECT,
        skip: (filterData.page - 1) * filterData.pageSize,
        take: Number(filterData.pageSize),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: filter,
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
      where: { id: id },
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
      where: { id: id },
    });
  }

  async createProfile(data: CreateProfileDto) {
    return this.prisma.profile.create({
      data: data
    })
  }

  async updateProfile(updateProfileDto: Partial<CreateProfileDto>) {
    const {userId, ...data} = updateProfileDto;

    return this.prisma.profile.update({
      where: {userId},
      data,
    })
  }

  async getProfileInfo(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId }
    })
  }
}
