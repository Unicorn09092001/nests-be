import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.authorService.findAll(query, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findById(id);
  }

  @Patch()
  update(@Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(id);
  }
}
