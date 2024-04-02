import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway, ChatService, PrismaService, JwtService],
})
export class ChatModule {}
