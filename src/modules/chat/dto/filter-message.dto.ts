import { IsInt, IsOptional, IsString } from 'class-validator';

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
  page: number;

  @IsOptional()
  pageSize: number;
}