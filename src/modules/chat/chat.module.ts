import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { MessagesController } from './controllers/messages.controller';
import { RoomsController } from './controllers/room.controller';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    ChatService, 
    ChatGateway, 
    ChatRepository, 
    JwtService,
  ],
  controllers: [MessagesController, RoomsController],
  exports: [ChatService],
})

export class ChatModule {}