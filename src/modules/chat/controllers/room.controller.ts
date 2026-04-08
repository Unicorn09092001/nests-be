import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { CreateRoomDto, RoomType, UpdateRoomDto } from '../dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}
  
  @Get()
  findAll(
    @Query('createdById') createdById: number,
    @Query('current') page: number,
    @Query('pageSize') pageSize: number,
    @Query('type') type: RoomType,
  ) {
    return this.chatService.getRooms({createdById, page, pageSize, type});
  }

  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto
  ) {
    return this.chatService.createRoom(createRoomDto);
  }

  @Patch()
  update(@Body() updateRoomDto: UpdateRoomDto) {
    return this.chatService.updateRoom(updateRoomDto);
  }

  @Get('find-private-between-users')
  findPrivateBetweenUsers(@Query('userIds') userIds: string) {
    const ids = userIds.split(',').map(id => parseInt(id.trim()));
    return this.chatService.findPrivateRoomBetweenUsers(ids);
  }
}
