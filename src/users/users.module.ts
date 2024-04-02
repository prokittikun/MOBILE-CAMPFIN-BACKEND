import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../database/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TripModule } from '../trip/trip.module';
import { TripService } from '../trip/trip.service';
import { PaginationService } from '../utils/pagination/createPagination.service';

@Module({
  imports: [JwtModule, forwardRef(() => TripModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    TripService,
    PaginationService,
    JwtService,
  ],
})
export class UsersModule {}
