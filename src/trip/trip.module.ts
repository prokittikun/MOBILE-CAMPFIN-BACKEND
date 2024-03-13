import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { PrismaService } from '../database/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../authentication/authentication.guard';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from '../utils/pagination/createPagination.service';

@Module({
  imports: [JwtModule],
  controllers: [TripController],
  providers: [TripService, PrismaService, PaginationService],
})
export class TripModule {}
