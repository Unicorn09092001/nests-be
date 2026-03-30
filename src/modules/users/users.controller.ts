import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/decorator/customize';
import { DeleteResult } from 'mongodb';
import { ActiveUserDto } from './dto/active-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.usersService.findAll(query, current, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get()
  findOneByEmail(@Param('email') email:string) {
    return this.usersService.findOneByEmail(email);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.usersService.remove(id);
  }

  @Patch("active")
  @Public()
  active(@Body() activeUserDto: ActiveUserDto) {
    return this.usersService.active(activeUserDto);
  }
}
