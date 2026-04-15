import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filterData: FilterCategoryDto) {
    const { name, createdAt, updatedAt, page, pageSize } = filterData;
    const filter = {
      name: name ? name?.trim() : undefined,
      createdAt,
      updatedAt,
    };

    return Promise.all([
      this.prisma.category.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.category.count({
        where: filter,
      }),
    ]);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
        where: {id: updateCategoryDto.id},
        data: {
            name: updateCategoryDto.name
        }
    })
  }

  async delete(id: string) {
    return this.prisma.category.delete({
        where: {id}
    })
  }
}
