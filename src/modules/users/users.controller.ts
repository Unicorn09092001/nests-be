import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Permissions, Public } from '@/decorator/customize';
import { PermissionEnum } from '@/common/enum/permission.enum';
import { ActiveUserDto, CreateProfileDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';

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

  @Patch("profile")
  updateProfile(
    @Req() req,
    @Body() updateProfile: CreateProfileDto
  ) {
    return this.usersService.updateProfile(updateProfile, req.user.id);
  }
}
