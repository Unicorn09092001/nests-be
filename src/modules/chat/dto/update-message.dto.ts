import { IsEmpty, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  content: string;

  @IsEmpty()
  id: number;
}
