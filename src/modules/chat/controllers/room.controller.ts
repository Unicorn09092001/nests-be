import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { CreateRoomDto } from '../dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}
  
  @Get()
  findAll(
    @Query('createdById') createdById: number,
    @Query('current') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.chatService.getRooms({createdById, page, pageSize});
  }

  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto
  ) {
    return this.chatService.createRoom(createRoomDto);
  }

  @Patch()
  update() {
    return this.chatService.updateRoom();
  }
}
