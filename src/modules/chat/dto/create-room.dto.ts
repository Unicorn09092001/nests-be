import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum RoomType {
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  users: number[];

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsString()
  @IsNotEmpty()
  type: RoomType;
}

export class UpdateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  users: number[];

  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  type?: RoomType;
}