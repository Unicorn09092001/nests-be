import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { PermissionEnum } from '@/common/enum/permission.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { permission } from 'process';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filterData: any) {
    // const filter = {
    //   id: filterData.id ?? undefined,
    //   email: filterData.email,
    // }

    return await Promise.all([
      this.prisma.role.findMany({
        // where: filter,
        skip: (filterData.page - 1) * filterData.pageSize,
        take: Number(filterData.pageSize),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.role.count({
        // where: filter,
      }),
    ]) 
  }

  async getPermission() {
    // for (const permission of Object.values(PermissionEnum)) {
    //     await this.prisma.permission.upsert({
    //         where: { name: permission },
    //         update: {},
    //         create: { name: permission },
    //     });
    // }

    return await Promise.all([
        this.prisma.permission.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        }),
        this.prisma.permission.count()
    ])
  }

  async create(data: CreateRoleDto) {
    return this.prisma.role.create({
        data: {
            name: data.name,
            permissions: {
                connect: data.permissions.map(permission => ({id: permission}))
            }
        },
    })
  }
}
