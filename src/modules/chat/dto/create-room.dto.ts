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

