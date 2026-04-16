import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleRepository } from './roles.repository';
import { getPagingMeta } from '@/helpers/util';

@Injectable()
export class RolesService {
  constructor(
      private readonly roleRepo: RoleRepository,
    ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepo.create(createRoleDto)

    return role;
  }

  async findAll() {
    const [data, count] = await this.roleRepo.findAll({
      page: 1,
      pageSize: 10
    })
    return {
      data,
      meta: getPagingMeta(count, 1, 10)
    };
  }

  async findPermission() {
    const [data, count] = await this.roleRepo.getPermission()

    return {
      data,
      meta: getPagingMeta(count, 1, 10)
    }
  }
}
