import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogService } from '../utils/log/log.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new LogService(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.db('Prisma connected');
    } catch (error) {
      this.logger.error('Prisma connection error', error);
    }
  }
}
