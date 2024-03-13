import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogService } from './utils/log/log.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './database/prisma.service';
import { TripModule } from './trip/trip.module';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    AuthenticationModule,
    UsersModule,
    TripModule,
    PlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService, LogService, PrismaService],
})
export class AppModule {}
