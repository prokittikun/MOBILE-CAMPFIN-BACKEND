import { PlaceService } from './place.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
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
}
