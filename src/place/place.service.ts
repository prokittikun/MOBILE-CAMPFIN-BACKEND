import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LogService } from '../utils/log/log.service';
import { PaginationService } from '../utils/pagination/createPagination.service';
import { PaginationDto } from '../utils/pagination/dto/pagination.dto';
import { Place, Prisma, Trip } from '@prisma/client';
import { ResPaginationDataDto } from '../utils/pagination/dto/res-pagination-data.dto';
import { ReqCreatePlaceDataDto } from './dto/requests/req-create-place-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import { EnumStatus } from '../enum/status.enum';
import { Request } from 'express';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { s3 } from '../utils/S3-Client';
import { ReqUpdatePlaceDataDto } from './dto/requests/req-update-place-data.dto';
import { ReqCreateReviewDataDto } from './dto/requests/req-create-review-data.dto';
@Injectable()
export class PlaceService {
  private logger = new LogService(PlaceService.name);
  private campBucket = 'camp';

  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async ApiVisitedPlaces(req: Request): Promise<ResDataDto<Place[]>> {
    const tag = this.ApiVisitedPlaces.name;
    try {
      const res: ResDataDto<Place[]> = {
        statusCode: EnumStatus.success,
        data: await this.visitedPlaces(req),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async visitedPlaces(req: Request): Promise<Place[]> {
    try {
      const reward = await this.prisma.rewardAchieved.findMany({
        where: {
          userId: req.user.sub,
        },
        include: {
          Reward: {
            include: {
              Place: true,
            },
          },
        },
      });
      const places = reward.map((r) => ({
        ...r.Reward.Place,
        image: `${process.env.S3_URL}/${this.campBucket}/${r.Reward.Place.image}`,
      }));
      return places;
    } catch (error) {
      throw error;
    }
  }
  async ApiCreatePlace(
    req: Request,
    placeData: ReqCreatePlaceDataDto,
    placeImage: Express.Multer.File,
  ): Promise<ResDataDto<Place>> {
    const tag = this.ApiCreatePlace.name;
    try {
      const res: ResDataDto<Place> = {
        statusCode: EnumStatus.success,
        data: await this.createPlace(req, placeData, placeImage),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async ApiCreateReview(
    req: Request,
    reviewData: ReqCreateReviewDataDto,
  ): Promise<ResDataDto<Place>> {
    const tag = this.ApiCreateReview.name;
    try {
      const res: ResDataDto<Place> = {
        statusCode: EnumStatus.success,
        data: await this.createReview(req, reviewData),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async createReview(
    req: Request,
    reviewData: ReqCreateReviewDataDto,
  ): Promise<any> {
    try {
      const place = await this.findUnique({
        name: reviewData.placeName,
      });
      if (!place) {
        throw new HttpException('Place not found', 404);
      }
      const createReview = await this.prisma.review.create({
        data: {
          rating: reviewData.rating,
          content: reviewData.content,
          Place: {
            connect: {
              name: place.name,
            },
          },
          User: {
            connect: {
              id: req.user.sub,
            },
          },
        },
      });
      return createReview;
    } catch (error) {
      throw error;
    }
  }

  async ApiGetReviews(placeName: string): Promise<any> {
    const tag = this.ApiGetReviews.name;
    try {
      const res: ResDataDto<Place> = {
        statusCode: EnumStatus.success,
        data: await this.getReviews(placeName),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getReviews(placeName: string): Promise<any> {
    try {
      const place = await this.findUnique({
        name: placeName,
      });
      if (!place) {
        throw new HttpException('Place not found', 404);
      }
      const reviews = await this.prisma.review.findMany({
        where: {
          placeName: place.name,
        },
        include: {
          User: true,
        },
      });
      return reviews;
    } catch (error) {
      throw error;
    }
  }
  async createPlace(
    req: Request,
    placeData: ReqCreatePlaceDataDto,
    placeImage: Express.Multer.File,
  ): Promise<Place> {
    try {
      const fileName = `${placeData.name}-${new Date().getTime()}`;

      const imageUrl = fileName + '.jpg';
      const placeDataWithImage = Object.assign(placeData, {
        image: imageUrl,
        latitude: Number(placeData.latitude),
        longitude: Number(placeData.longitude),
      });
      const createdData = await this.create(placeDataWithImage);
      const data = await s3.send(
        new PutObjectCommand({
          Bucket: this.campBucket,
          Key: fileName + '.jpg',
          Body: placeImage.buffer,
        }),
      );
      console.log('data', data);
      return createdData;
    } catch (error) {
      throw error;
    }
  }

  async ApiUpdatePlace(
    req: Request,
    placeData: ReqUpdatePlaceDataDto,
    placeImage: Express.Multer.File,
  ): Promise<ResDataDto<Place>> {
    const tag = this.ApiUpdatePlace.name;
    try {
      const res: ResDataDto<Place> = {
        statusCode: EnumStatus.success,
        data: await this.updatePlace(req, placeData, placeImage),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async updatePlace(
    req: Request,
    placeData: ReqUpdatePlaceDataDto,
    placeImage: Express.Multer.File,
  ): Promise<Place> {
    try {
      const camp = await this.findUnique({
        name: placeData.name,
      });
      if (!camp) {
        throw new HttpException('Place not found', 404);
      }
      const fileName = `${placeData.name}-${new Date().getTime()}`;

      const imageUrl = fileName + '.jpg';
      const placeDataWithImage = Object.assign(placeData, {
        image: imageUrl,
        latitude: Number(placeData.latitude),
        longitude: Number(placeData.longitude),
      });
      await s3.send(
        new DeleteObjectCommand({
          Bucket: this.campBucket,
          Key: camp.image,
        }),
      );
      await s3.send(
        new PutObjectCommand({
          Bucket: this.campBucket,
          Key: fileName + '.jpg',
          Body: placeImage.buffer,
        }),
      );
      const updatedData = await this.update({
        where: {
          name: placeData.name,
        },
        data: placeDataWithImage,
      });

      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  async ApiDeletePlace(placeName: string): Promise<ResDataDto<Place>> {
    const tag = this.ApiDeletePlace.name;
    try {
      const res: ResDataDto<Place> = {
        statusCode: EnumStatus.success,
        data: await this.deletePlace(placeName),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async deletePlace(placeName: string): Promise<Place> {
    const place = await this.findUnique({
      name: placeName,
    });
    if (!place) {
      throw new HttpException('Place not found', 404);
    }
    await s3.send(
      new DeleteObjectCommand({
        Bucket: this.campBucket,
        Key: place.image,
      }),
    );
    return await this.delete({
      name: placeName,
    });
  }

  async ApiGetPlaces(
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Place[]>> {
    const tag = this.ApiGetPlaces.name;
    try {
      return await this.getPlaces(paginationData);
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getPlaces(
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Place[]>> {
    const totalItems = await this.prisma.place.count({
      where: {
        name: {
          contains: paginationData.search || '',
        },
      },
    });
    const paginationCalc = this.paginationService.paginationCal(
      totalItems,
      paginationData.perPages,
      paginationData.currentPage,
    );
    const data = await this.prisma.place.findMany({
      skip: paginationCalc.skips,
      take: paginationCalc.limit,
      where: {
        name: {
          contains: paginationData.search || '',
        },
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    });
    const itemPerpage = data.length;
    const res: ResPaginationDataDto<Place[]> = {
      totalItems: totalItems,
      itemsPerPage: itemPerpage,
      totalPages: paginationCalc.totalPages,
      currentPage: paginationData.currentPage,
      option: {
        search: paginationData.search,
        sortField: paginationData.sortField,
        sortType: paginationData.sortType,
      },
      // concat image url
      datas: data.map((place) => {
        if (place.image.includes('http://') || place.image.includes('https://'))
          return place;
        return {
          ...place,
          image: `${process.env.S3_URL}/${this.campBucket}/${place.image}`,
        };
      }),
    };
    return res;
  }
  async ApiGetPlace(placeName: string): Promise<ResDataDto<Place>> {
    const tag = this.ApiGetPlace.name;
    try {
      const res: ResDataDto<Place> = {
        statusCode: EnumStatus.success,
        data: await this.getPlace(placeName),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getPlace(placeName: string): Promise<Place> {
    const data = await this.findUnique({
      name: placeName,
    });
    data.image = `${process.env.S3_URL}/${this.campBucket}/${data.image}`;
    return data;
  }

  async create(data: Prisma.PlaceCreateInput): Promise<Place> {
    return await this.prisma.place
      .create({
        data,
      })
      .catch((error) => {
        throw new HttpException("Can't create place", 500);
      });
  }

  async findUnique(
    placeWhereUniqueInput: Prisma.PlaceWhereUniqueInput,
    select?: Prisma.PlaceSelect,
  ): Promise<Place | null> {
    return await this.prisma.place.findUnique({
      where: placeWhereUniqueInput,
      select,
    });
  }

  async find(
    placeWhereInput: Prisma.PlaceWhereInput,
    select?: Prisma.PlaceSelect,
  ): Promise<Place | null> {
    return await this.prisma.place.findFirst({
      where: placeWhereInput,
      select,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PlaceWhereUniqueInput;
    where?: Prisma.PlaceWhereInput;
    select?: Prisma.PlaceSelect;
    orderBy?: Prisma.PlaceOrderByWithRelationInput;
  }): Promise<Place[]> {
    const { skip, take, cursor, where, select, orderBy } = params;
    return await this.prisma.place.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async update(params: {
    where: Prisma.PlaceWhereUniqueInput;
    data: Prisma.PlaceUpdateInput;
  }): Promise<Place> {
    const { where, data } = params;
    return await this.prisma.place.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.PlaceWhereUniqueInput): Promise<Place> {
    return await this.prisma.place.delete({
      where,
    });
  }
}
