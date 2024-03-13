import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { AuthGuard } from '../authentication/authentication.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/reflector';
import { Request } from 'express';
import { ReqCreateTripDataDto } from './dto/requests/req-create-trip-data.dto';
import { ApiOkResponseData } from '../decorator/ApiOkResponse.decorator';
import { ResCreateTripDataDto } from './dto/responses/res-create-trip-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import {
  Agenda,
  PreTripParticipant,
  Trip,
  TripParticipant,
} from '@prisma/client';
import { PaginationDto } from '../utils/pagination/dto/pagination.dto';
import { ResPaginationDataDto } from '../utils/pagination/dto/res-pagination-data.dto';
import { ReqUpdateTripDataDto } from './dto/requests/req-update-trip-data.dto';
import { ReqJoinTripDataDto } from './dto/requests/req-join-trip-data.dto';
import { ReqLeaveTripDataDto } from './dto/requests/req-leave-trip-data.dto';
import { ReqKickMemberOfTripDataDto } from './dto/requests/req-kick-member-of-trip-data.dto';
import { ReqLeavePreTripDataDto } from './dto/requests/req-leave-pre-trip-data.dto';
import { ResParticipantDataDto } from './dto/responses/res-partipant-data.dto';
import { ReqApproveMemberOfTripDataDto } from './dto/requests/req-approve-member-of-trip-data.dto';
import {
  ReqCreateAgendaDto,
  ReqRootAgendaDto,
} from './dto/requests/req-create-agenda.dto';
import { ReqUpdateAgendaDetailsDto } from './dto/requests/req-update-agenda-details.dto';
import { ReqDeleteAgendaDetailsDto } from './dto/requests/req-delete-agenda-details.dto';
import { ResAgendaDto } from './dto/responses/res-agenda-data.dto';

@Controller('trip')
@ApiTags('Trip')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('create-trip')
  @ApiOkResponseData(ResCreateTripDataDto)
  async createTrip(
    @Req() req: Request,
    @Body() tripData: ReqCreateTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiCreateTrip(req, tripData);
  }

  @Patch('update-trip')
  @ApiOkResponseData(ResCreateTripDataDto)
  async updateTrip(
    @Req() req: Request,
    @Body() tripData: ReqUpdateTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiUpdateTrip(req, tripData);
  }

  @Delete('delete-trip/:tripId')
  @ApiOkResponseData(ResCreateTripDataDto)
  async deleteTrip(
    @Req() req: Request,
    @Param('tripId') id: string,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiDeleteTrip(req, id);
  }

  @Post('approve-member')
  @ApiOkResponseData(ResCreateTripDataDto)
  async approveMember(
    @Req() req: Request,
    @Body() approveMemberData: ReqApproveMemberOfTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiApproveMember(req, approveMemberData);
  }

  @Post('kick-member')
  @ApiOkResponseData(ResCreateTripDataDto)
  async kickMember(
    @Req() req: Request,
    @Body() kickMemberData: ReqKickMemberOfTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiKickMember(req, kickMemberData);
  }

  @Post('get-trips')
  @ApiOkResponseData(ResCreateTripDataDto, true)
  async getTrips(
    @Body() pagination: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    return await this.tripService.ApiGetAllTrips(pagination);
  }

  @Post('my-joined-trips')
  @ApiOkResponseData(ResCreateTripDataDto, true)
  async getMyJoinedTrips(
    @Req() req: Request,
    @Body() pagination: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    return await this.tripService.ApiMyJoinedTrips(req, pagination);
  }

  @Post('my-created-trips')
  @ApiOkResponseData(ResCreateTripDataDto, true)
  async getMyTrips(
    @Req() req: Request,
    @Body() pagination: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    return await this.tripService.ApiMyCreatedTrips(req, pagination);
  }

  @Get('get-members/:tripId')
  @ApiOkResponseData(ResParticipantDataDto)
  async getMembers(@Param('tripId') tripId: string): Promise<
    ResDataDto<{
      participant: TripParticipant[];
      preParticipant: PreTripParticipant[];
    }>
  > {
    return await this.tripService.ApiGetMembers(tripId);
  }

  @Get(':tripId')
  @ApiOkResponseData(ResCreateTripDataDto)
  async getTrip(
    @Param('tripId') findTripData: string,
  ): Promise<ResDataDto<Trip>> {
    return this.tripService.ApiGetTrip(findTripData);
  }

  @Post('join-trip')
  @ApiOkResponseData(ResCreateTripDataDto)
  async joinTrip(
    @Req() req: Request,
    @Body() joinTripData: ReqJoinTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiJoinTrip(req, joinTripData);
  }

  @Post('join-pre-trip')
  @ApiOkResponseData(ResCreateTripDataDto)
  async joinPreTrip(
    @Req() req: Request,
    @Body() joinTripData: ReqJoinTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiJoinPreTrip(req, joinTripData);
  }

  @Post('leave-trip')
  @ApiOkResponseData(ResCreateTripDataDto)
  async leaveTrip(
    @Req() req: Request,
    @Body() leaveTripData: ReqLeaveTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiLeaveTrip(req, leaveTripData);
  }

  @Post('leave-pre-trip')
  @ApiOkResponseData(ResCreateTripDataDto)
  async leavePreTrip(
    @Req() req: Request,
    @Body() leaveTripData: ReqLeavePreTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    return await this.tripService.ApiLeavePreTrip(req, leaveTripData);
  }

  //agenda
  @Post('create-agenda')
  @ApiOkResponseData(ResAgendaDto)
  async createAgenda(
    @Req() req: Request,
    @Body() agendaData: ReqRootAgendaDto,
  ): Promise<ResDataDto<Agenda>> {
    return await this.tripService.ApiCreateAgenda(req, agendaData);
  }

  @Patch('update-agenda-details')
  @ApiOkResponseData(ResAgendaDto)
  async updateAgendaDetails(
    @Req() req: Request,
    @Body() agendaData: ReqUpdateAgendaDetailsDto,
  ): Promise<ResDataDto<Agenda>> {
    return await this.tripService.ApiUpdateAgenda(req, agendaData);
  }

  @Delete('delete-agenda-details')
  @ApiOkResponseData(ResAgendaDto)
  async deleteAgendaDetails(
    @Req() req: Request,
    @Body() agendaDetailIds: ReqDeleteAgendaDetailsDto,
  ): Promise<ResDataDto<Agenda>> {
    return await this.tripService.ApiDeleteAgendaDetails(req, agendaDetailIds);
  }

  // @Get('trips')
  // getTrips() {
  //   // return this.tripService.getTrips();
  //   return;
  // }

  // @Get('trips/test')
  // @Public()
  // getTrip() {
  //   // return this.tripService.getTrip();
  //   return 'trip';
  // }
}
