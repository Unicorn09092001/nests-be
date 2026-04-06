import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsString()
  roomId: string;

  @IsString()
  senderId: string;
}

