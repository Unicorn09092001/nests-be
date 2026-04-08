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
import { FilterMessageDto } from './dto/filter-message.dto';
import { CreateRoomDto, RoomType, UpdateRoomDto } from './dto/create-room.dto';

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
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() params: {
    roomId: number,
    users: number[],
  }) {
    if (!params.roomId) {
      if (!params.users) return;
      const room = await this.chatService.findPrivateRoomBetweenUsers(params.users)

      if (!room) {
        const createRoom = await this.chatService.createRoom({
          name: 'private room',
          users: params.users,
          createdById: params.users[0],
          type: RoomType.PRIVATE
        })

        client.join(`${createRoom.id}`);
        this.server.emit('receive_room', {room: createRoom, action: "CONVERSATION"});
      } else {
        client.join(`${room.id}`);
        this.server.emit('receive_room', {room, action: "CONVERSATION"});
      }
      return;
    }

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
    @MessageBody() payload: CreateRoomDto,
  ) {
    const user = client.data.user;

    // save DB
    const room = await this.chatService.createRoom({
      name: payload.name,
      users: payload.users,
      createdById: Number(user.userId),
      type: payload.type,
    });

    // emit room
    if (payload.type === RoomType.GROUP)
    this.server.emit('receive_room', {room, action: "CREATE"});
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('update_room')
  async handleUpdateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: UpdateRoomDto,
  ) {
    const user = client.data.user;

    // save DB
    const room = await this.chatService.updateRoom({
      name: payload.name,
      users: payload.users,
      id: Number(payload.id)
    });

    // emit room
    this.server.emit('receive_room', {room, action: "UPDATE"});
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('delete_room')
  async handleDeleteRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {roomId: number},
  ) {
    const user = client.data.user;

    // save DB
    const room = await this.chatService.deleteRoom(payload.roomId);

    // emit room
    this.server.emit('receive_room', {room, action: "DELETE"});
  }
}
