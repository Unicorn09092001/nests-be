import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Filter } from 'mongodb';
import { FilterMessageDto } from './dto/filter-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private chatService: ChatService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  // 🟢 user connect
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || "";

    try {
      if (token) {
        const user = this.jwtService.verify(
          token, 
          {
            secret: this.configService.get<string>('JWT_SECRET_KEY'), // Optional if configured globally
          }
        );
        client.data.user = user; // 🔥 lưu vào socket
        console.log('User connected:', client.id, 'User:', user.email || user.id);
      } else {
        // Allow anonymous connection but mark as unauthenticated
        client.data.user = null;
        console.log('Anonymous user connected:', client.id);
      }
    } catch (error: any) {
      // Token is invalid, but allow connection (authentication will be checked per message)
      client.data.user = null;
      console.log('User connected with invalid token:', client.id, 'Error:', error.message);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
  }

  // 👥 join room
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() params: FilterMessageDto) {
    client.join(`${params.roomId}`);
  }

  // 💬 send message
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const user = client.data.user;

    // save DB
    const message = await this.chatService.createMessage({
      senderId: Number(user.userId),
      content: payload.content,
      roomId: payload.roomId,
    });

    // emit room
    this.server.to(`${payload.roomId}`).emit('receive_message', message);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('create_room')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const user = client.data.user;

    // save DB
    // const message = await this.chatService.createMessage({
    //   senderId: user.userId,
    //   content: payload.content,
    //   roomId: payload.roomId,
    // });

    // emit room
    // this.server.to(payload.roomId).emit('receive-message', message);
  }
}
