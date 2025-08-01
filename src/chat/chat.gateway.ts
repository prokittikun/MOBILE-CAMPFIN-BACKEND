import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../database/prisma.service';
import { ChatService } from './chat.service';
import { TripChatDto } from './dto/create-chat.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authentication/authentication.guard';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ path: '/trip-chat' })
// @UseGuards(AuthGuard)
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      client.disconnect();
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.userId = payload.sub; // Assuming the user ID is stored in the 'sub' property
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  @SubscribeMessage('joinTripChat')
  async joinTripChat(client: Socket, tripId: string) {
    client.join(`trip-${tripId}`);
  }

  @SubscribeMessage('sendTripChat')
  async sendTripChat(client: Socket, payload: TripChatDto) {
    const { tripId, content } = payload;

    // Save the chat message to the database
    const chat = await this.prisma.tripChat.create({
      data: {
        content,
        Trip: { connect: { id: tripId } },
        User: { connect: { id: client.data.userId } },
      },
    });

    // Broadcast the new chat message to all clients in the trip chat room
    this.server.to(`trip-${tripId}`).emit('receiveTripChat', chat);
  }
}
