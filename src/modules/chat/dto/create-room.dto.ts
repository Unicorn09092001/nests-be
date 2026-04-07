import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  users: number[];

  @IsInt()
  @IsOptional()
  createdById: number;
}

export class UpdateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  users: number[];

  @IsNotEmpty()
  id: number;
}