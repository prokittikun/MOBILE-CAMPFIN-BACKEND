import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { TripModule } from '../trip/trip.module';
import { TripService } from '../trip/trip.service';
import { PaginationService } from '../utils/pagination/createPagination.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      }),
    }),
    TripModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UsersService,
    PrismaService,
    GoogleStrategy,
    TripService,
    PaginationService,
  ],
})
export class AuthenticationModule {}
