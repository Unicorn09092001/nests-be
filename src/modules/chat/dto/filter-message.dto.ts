import { IsInt, IsOptional, IsString } from 'class-validator';
import { RoomType } from './create-room.dto';

export class FilterMessageDto {
  @IsInt()
  roomId: number;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}

export class FilterRoomDto {
  @IsInt()
  createdById: number;

  @IsOptional()
  type?: RoomType

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}