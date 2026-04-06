import { IsOptional, IsString } from 'class-validator';

export class FilterMessageDto {
  @IsString()
  roomId: string;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}
