import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorRepository } from './author.repository';
import aqp from 'api-query-params';
import { getPagingMeta } from '@/helpers/util';

@Injectable()
export class AuthorService {
  constructor(
    private readonly authorRepo: AuthorRepository
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorRepo.create(createAuthorDto)

    return author;
  }

  async findAll(query: string, page: number, pageSize: number) {
    const { filter } = aqp(query);

    const [data, count] = await this.authorRepo.findAll({
      name: filter?.name,
      description: filter?.description,
      bookIds: filter?.bookIds ?? [],
      page: page,
      pageSize: pageSize,
    })

    return {
      data,
      meta: getPagingMeta(count, page, pageSize)
    };
  }

  async findById(id: string) {
    const author = await this.authorRepo.findById(id)

    return author;
  }

  async update(updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorRepo.update(updateAuthorDto)

    return author;
  }

  async remove(id: string) {
    const author = await this.authorRepo.delete(id)

    return author;
  }
}
