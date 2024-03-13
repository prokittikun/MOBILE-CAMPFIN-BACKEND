import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LogService } from '../utils/log/log.service';
import { PaginationService } from '../utils/pagination/createPagination.service';
import { PaginationDto } from '../utils/pagination/dto/pagination.dto';
import { Place, Prisma } from '@prisma/client';
import { ResPaginationDataDto } from '../utils/pagination/dto/res-pagination-data.dto';
import { ReqCreatePlaceDataDto } from './dto/requests/req-create-place-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import { EnumStatus } from '../enum/status.enum';
import { Request } from 'express';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3 } from '../utils/S3-Client';
@Injectable()
export class PlaceService {
  private logger = new LogService(PlaceService.name);
  private campBucket = 'camp';

  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

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
