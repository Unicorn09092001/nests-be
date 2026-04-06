import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    ChatService, 
    ChatGateway, 
    ChatRepository, 
    JwtService,
  ],
  exports: [ChatService],
})
export class ChatModule {}