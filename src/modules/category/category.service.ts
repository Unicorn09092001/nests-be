import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import aqp from 'api-query-params';
import { getPagingMeta } from '@/helpers/util';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const [data, count] = await this.categoryRepo.findAll({name: createCategoryDto.name, page: 1, pageSize: 10})

    if (count > 0) {
      throw new BadRequestException("Category name already exists");
    }

    const category = await this.categoryRepo.create(createCategoryDto);
    return category;
  }

  async findAll(query: string, page: number, pageSize: number) {
    const { filter } = aqp(query);
    const currentPage = page ?? 1;
    const currentPageSize = pageSize ?? 10;

    const [data, count] = await this.categoryRepo.findAll({
      name: filter.name,
      createdAt: filter.createdAt,
      updatedAt: filter.updatedAt,
      page: currentPage,
      pageSize: currentPageSize,
    })

    return {
      data,
      meta: getPagingMeta(count, currentPage, currentPageSize)
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.update(updateCategoryDto)

    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepo.delete(id);

    return category;
  }
}
