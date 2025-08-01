import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogService } from '../utils/log/log.service';
import { PrismaService } from '../database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { ReqUpdateProfileDataDto } from './dto/requests/req-update-profile-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import { EnumStatus } from '../enum/status.enum';
import { Request } from 'express';
import { s3 } from 'src/utils/S3-Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { TripService } from '../trip/trip.service';
@Injectable()
export class UsersService {
  private logger = new LogService(UsersService.name);
  private bucket = 'user';
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TripService))
    private tripService: TripService,
  ) {}

  async ApiUpdateProfile(
    req: Request,
    updateUserDto: ReqUpdateProfileDataDto,
    profileImage: Express.Multer.File,
  ) {
    const tag = this.ApiUpdateProfile.name;
    try {
      const res: ResDataDto<User> = {
        statusCode: EnumStatus.success,
        data: await this.updateProfile(req, updateUserDto, profileImage),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async updateProfile(
    req: Request,
    updateUserDto: ReqUpdateProfileDataDto,
    profileImage: Express.Multer.File,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      let data;
      if (profileImage) {
        //file name = uid + current timestamp .jpg
        const fileName = `${req.user.sub}-${Date.now()}.jpg`;
        const imageUrl = fileName;
        data = {
          ...updateUserDto,
          profileImage: imageUrl,
        };
        await s3.send(
          new PutObjectCommand({
            Bucket: 'user',
            Key: fileName,
            Body: profileImage.buffer,
          }),
        );
      } else {
        data = {
          ...updateUserDto,
        };
      }
      const userUpdate = await this.update({
        where: { id: req.user.sub },
        data,
      });

      return userUpdate;
    } catch (error) {
      throw error;
    }
  }

  async ApiGetProfile(req: Request) {
    const tag = this.ApiGetProfile.name;
    try {
      const res: ResDataDto<User> = {
        statusCode: EnumStatus.success,
        data: await this.getProfile(req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async ApiGetProfileById(userId: string) {
    const tag = this.ApiGetProfileById.name;
    try {
      const res: ResDataDto<User> = {
        statusCode: EnumStatus.success,
        data: await this.getProfile(userId),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          trips: true,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      const tripCount = user.trips.length;
      user.profileImage =
        user.profileImage != null
          ? user.profileImage.startsWith('http')
            ? user.profileImage
            : `${process.env.S3_URL}/${this.bucket}/${user.profileImage}`
          : null;
      const rewardAchieved = await this.tripService.getMyRewardArchived(userId);
      console.log('rewardAchieved', rewardAchieved);

      const userClone = Object.assign(user, {
        alias: '',
        rewardAchieved,
      });
      if (tripCount >= 0) {
        userClone.alias = 'นักแคมป์มือใหม่';
      } else if (tripCount > 2) {
        userClone.alias = 'ผู้มีประสบการณ์ในการแคมป์';
      } else {
        userClone.alias = 'ผู้เชี่ยวชาญด้านการแคมป์';
      }

      return userClone;
    } catch (error) {
      throw error;
    }
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const tag = this.create.name;
    return await this.prisma.user.create({
      data,
    });
  }

  async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select,
    });
  }

  async find(
    userWhereInput: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: userWhereInput,
      select,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    select?: Prisma.UserSelect;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy, select } = params;
    return await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return await this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }
}
