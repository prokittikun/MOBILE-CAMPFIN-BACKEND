import { PlaceService } from './place.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../utils/pagination/dto/pagination.dto';
import { ResPaginationDataDto } from '../utils/pagination/dto/res-pagination-data.dto';
import { Place } from '@prisma/client';
import { ApiOkResponseData } from '../decorator/ApiOkResponse.decorator';
import { ResPlaceDataDto } from './dto/responses/res-place-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { ReqCreatePlaceDataDto } from './dto/requests/req-create-place-data.dto';
import { imageFileFilter } from '../utils/validator';
import { ReqUpdatePlaceDataDto } from './dto/requests/req-update-place-data.dto';
import { ReqCreateReviewDataDto } from './dto/requests/req-create-review-data.dto';
import { AuthGuard } from '../authentication/authentication.guard';

@Controller('place')
@ApiTags('Place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('create-place')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponseData(ResPlaceDataDto)
  @UseInterceptors(
    FileInterceptor('placeImage', { fileFilter: imageFileFilter }),
  )
  async createPlace(
    @Req() req: Request,
    @Body() placeData: ReqCreatePlaceDataDto,
    @UploadedFile() placeImage: Express.Multer.File,
  ): Promise<ResDataDto<Place>> {
    console.log('placeData', placeImage);

    return await this.placeService.ApiCreatePlace(req, placeData, placeImage);
  }

  @Patch('update-place')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponseData(ResPlaceDataDto)
  @UseInterceptors(
    FileInterceptor('placeImage', { fileFilter: imageFileFilter }),
  )
  async updatePlace(
    @Req() req: Request,
    @Body() placeData: ReqUpdatePlaceDataDto,
    @UploadedFile() placeImage: Express.Multer.File,
  ): Promise<ResDataDto<Place>> {
    return await this.placeService.ApiUpdatePlace(req, placeData, placeImage);
  }

  @Delete('delete-place/:placeName')
  @ApiOkResponseData(ResPlaceDataDto)
  async deletePlace(
    @Param('placeName') placeName: string,
  ): Promise<ResDataDto<Place>> {
    return await this.placeService.ApiDeletePlace(placeName);
  }

  @Get('get-place/:placeId')
  @ApiOkResponseData(ResPlaceDataDto)
  async getPlace(
    @Param('placeId') placeId: string,
  ): Promise<ResDataDto<Place>> {
    return await this.placeService.ApiGetPlace(placeId);
  }

  @Post('get-places')
  @ApiOkResponseData(ResPlaceDataDto, true)
  async getPlaces(
    @Body() pagination: PaginationDto,
  ): Promise<ResPaginationDataDto<Place[]>> {
    return await this.placeService.ApiGetPlaces(pagination);
  }

  @Post('create-review')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createReview(
    @Req() req: Request,
    @Body() reviewData: ReqCreateReviewDataDto,
  ): Promise<any> {
    return await this.placeService.ApiCreateReview(req, reviewData);
  }

  @Get('get-reviews/:placeName')
  async getReviews(@Param('placeName') placeName: string): Promise<any> {
    return await this.placeService.ApiGetReviews(placeName);
  }
}
