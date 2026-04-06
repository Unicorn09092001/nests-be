import { IsInt, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsInt()
  roomId: number;

  @IsInt()
  senderId: number;
}

