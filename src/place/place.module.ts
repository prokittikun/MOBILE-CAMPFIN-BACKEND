import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { PaginationService } from '../utils/pagination/createPagination.service';

@Module({
  imports: [JwtModule],
  controllers: [PlaceController],
  providers: [PlaceService, PrismaService, PaginationService],
})
export class PlaceModule {}
