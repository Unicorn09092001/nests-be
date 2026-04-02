import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permissions, Public } from '@/decorator/customize';
import { DeleteResult } from 'mongodb';
import { ActiveUserDto } from './dto/active-user.dto';
import { PermissionEnum } from '@/common/enum/permission.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @Permissions(PermissionEnum.USER_CREATE)
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
  @Permissions(PermissionEnum.USER_UPDATE)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.USER_DELETE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch("active")
  @Public()
  active(@Body() activeUserDto: ActiveUserDto) {
    return this.usersService.active(activeUserDto);
  }
}
