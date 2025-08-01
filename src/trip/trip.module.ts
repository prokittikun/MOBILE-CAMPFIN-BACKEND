import { Module, forwardRef } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { PrismaService } from '../database/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../authentication/authentication.guard';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from '../utils/pagination/createPagination.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [JwtModule, forwardRef(() => UsersModule)],
  controllers: [TripController],
  providers: [
    TripService,
    PrismaService,
    PaginationService,
    AuthenticationService,
    UsersService,
  ],
})
export class TripModule {}
