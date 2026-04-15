import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.bookService.findAll(query, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  @Patch()
  update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Post("/borrow")
  borrow(@Body() borrowBookDto: BorrowBookDto) {
    return this.bookService.borrow(borrowBookDto);
  }

  @Get("/borrow-history")
  borrowHistory(
    @Query() query: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.bookService.borrowHistory(query, page, pageSize);
  }
}
