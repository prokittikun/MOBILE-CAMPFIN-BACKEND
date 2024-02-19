import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogService } from '../utils/log/log.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new LogService(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.db('Database connected');
  }
}
