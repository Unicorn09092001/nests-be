import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './book.repository';
import aqp from 'api-query-params';
import { getPagingMeta } from '@/helpers/util';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { EBookStatus } from './dto/filter-book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepo: BookRepository
  ){}

  async create(createBookDto: CreateBookDto) {
    const book = await this.bookRepo.create(createBookDto)

    return book;
  }

  async findAll(query: string, page: number, pageSize: number) {
    const { filter } = aqp(query);

    const [data, count] = await this.bookRepo.findAll({
      keyword: filter?.keyword ?? undefined,
      status: filter.status ?? undefined,
      categoryId: filter.categoryId ?? undefined,
      authorIds: filter.authorIds ?? [],
      page,
      pageSize
    })

    return {
      data,
      meta: getPagingMeta(count, page, pageSize)
    };
  }

  async findById(id: string) {
    const book = await this.bookRepo.findById(id)

    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    const book = await this.bookRepo.update(updateBookDto)

    return book;
  }

  async remove(id: string) {
    const book = await this.bookRepo.delete(id)

    return book;
  }

  async borrow(borrowBookDto: BorrowBookDto) {
    const book = await this.bookRepo.findById(borrowBookDto.bookId);

    if (book?.status !== "AVAILABLE") {
      throw new BadRequestException("The book is not available")
    }

    const borrowBook = await this.bookRepo.borrow(borrowBookDto);

    this.bookRepo.update({
      id: borrowBookDto.bookId,
      status: EBookStatus.BORROWED
    })
    
    return borrowBook;
  }

  async borrowHistory(query: string, page: number, pageSize: number) {
    const {filter} = aqp(query);

    const [data, count] = await this.bookRepo.borrowHistory();

    return {
      data,
      meta: getPagingMeta(count, page, pageSize)
    }
  }
}
