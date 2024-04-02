import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Agenda,
  Place,
  PreTripParticipant,
  Prisma,
  Trip,
  TripParticipant,
  TripStatus,
} from '@prisma/client';
import { Request } from 'express';
import { ResPaginationDataDto } from 'src/utils/pagination/dto/res-pagination-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import { PrismaService } from '../database/prisma.service';
import { EnumStatus } from '../enum/status.enum';
import { LogService } from '../utils/log/log.service';
import { PaginationService } from '../utils/pagination/createPagination.service';
import { PaginationDto } from '../utils/pagination/dto/pagination.dto';
import { ReqApproveMemberOfTripDataDto } from './dto/requests/req-approve-member-of-trip-data.dto';
import { ReqCreateTripDataDto } from './dto/requests/req-create-trip-data.dto';
import { ReqJoinTripDataDto } from './dto/requests/req-join-trip-data.dto';
import { ReqKickMemberOfTripDataDto } from './dto/requests/req-kick-member-of-trip-data.dto';
import { ReqLeavePreTripDataDto } from './dto/requests/req-leave-pre-trip-data.dto';
import { ReqLeaveTripDataDto } from './dto/requests/req-leave-trip-data.dto';
import { ReqUpdateTripDataDto } from './dto/requests/req-update-trip-data.dto';
import {
  ReqCreateAgendaDto,
  ReqRootAgendaDto,
} from './dto/requests/req-create-agenda.dto';
import * as moment from 'moment';
import { ReqUpdateAgendaDetailsDto } from './dto/requests/req-update-agenda-details.dto';
import { ReqDeleteAgendaDetailsDto } from './dto/requests/req-delete-agenda-details.dto';

@Injectable()
export class TripService {
  private logger = new LogService(TripService.name);

  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async ApiGetTrip(id: string): Promise<ResDataDto<Trip>> {
    const tag = this.ApiGetTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.getTrip(id),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getTrip(id: string): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: id },
      {
        id: true,
        title: true,
        maxParticipant: true,
        isPublic: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        Agenda: {
          select: {
            id: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            agendaDetail: {
              select: {
                id: true,
                title: true,
                description: true,
                timeStart: true,
                timeEnd: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        participants: {
          where: {
            isPending: false,
          },
          select: { userId: true, isPending: true, createdAt: true },
        },
        preParticipants: {
          select: {
            userId: true,
            createdAt: true,
          },
        },
        Place: {
          select: {
            name: true,
            image: true,
            description: true,
            address: true,
            contact: true,
            location: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    )) as (Trip & { Place: Place }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    trip.Place = {
      ...trip.Place,
      image: trip.Place.image
        ? `${process.env.S3_URL}/camp/${trip.Place.image}`
        : null,
    };
    return trip;
  }

  async ApiMyCreatedTrips(
    req: Request,
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    const tag = this.ApiMyCreatedTrips.name;
    try {
      return await this.myCreatedTrips(req, paginationData);
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async myCreatedTrips(
    req: Request,
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    const totalItems = await this.prisma.trip.count({
      where: {
        userId: req.user.sub,
        title: {
          contains: paginationData.search || '',
        },
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    });
    const paginationCalc = this.paginationService.paginationCal(
      totalItems,
      paginationData.perPages,
      paginationData.currentPage,
    );
    const data = (await this.findAll({
      skip: paginationCalc.skips,
      take: paginationCalc.limit,
      where: {
        userId: req.user.sub,
        title: {
          contains: paginationData.search || '',
        },
      },
      select: {
        id: true,
        title: true,
        maxParticipant: true,
        isPublic: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        Agenda: {
          select: {
            id: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            agendaDetail: {
              select: {
                id: true,
                title: true,
                description: true,
                timeStart: true,
                timeEnd: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        participants: {
          where: {
            isPending: false,
          },
          select: {
            userId: true,
            isPending: true,
            createdAt: true,
          },
        },
        preParticipants: {
          select: {
            userId: true,
            createdAt: true,
          },
        },
        Place: {
          select: {
            name: true,
            image: true,
            description: true,
            address: true,
            contact: true,
            location: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    })) as (Trip & { Place: Place })[];
    const itemPerpage = data.length;
    const res: ResPaginationDataDto<Trip[]> = {
      totalItems: totalItems,
      itemsPerPage: itemPerpage,
      totalPages: paginationCalc.totalPages,
      currentPage: paginationData.currentPage,
      option: {
        search: paginationData.search,
        sortField: paginationData.sortField,
        sortType: paginationData.sortType,
      },
      datas: data.map((d) => ({
        ...d,
        Place: {
          ...d.Place,
          image: d.Place.image
            ? `${process.env.S3_URL}/camp/${d.Place.image}`
            : null,
        },
      })),
    };
    return res;
  }

  async ApiGetMembers(tripId: string): Promise<
    ResDataDto<{
      participant: TripParticipant[];
      preParticipant: PreTripParticipant[];
    }>
  > {
    const tag = this.ApiGetMembers.name;
    try {
      const res: ResDataDto<{
        participant: TripParticipant[];
        preParticipant: PreTripParticipant[];
      }> = {
        statusCode: EnumStatus.success,
        data: await this.getMembers(tripId),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getMembers(tripId: string): Promise<{
    participant: TripParticipant[];
    preParticipant: PreTripParticipant[];
  }> {
    const trip = (await this.findUnique(
      { id: tripId },
      {
        participants: {
          select: {
            userId: true,
            isPending: true,
            createdAt: true,
          },
        },
        preParticipants: {
          select: {
            userId: true,
            createdAt: true,
          },
        },
      },
    )) as
      | (Trip & {
          participants: TripParticipant[];
          preParticipants: PreTripParticipant[];
        })
      | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    return {
      participant: trip.participants,
      preParticipant: trip.preParticipants,
    };
  }

  async ApiGetAllTrips(
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    const tag = this.ApiGetAllTrips.name;
    try {
      return await this.getAllTrips(paginationData);
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async getAllTrips(
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    const totalItems = await this.prisma.trip.count({
      where: {
        title: {
          contains: paginationData.search || '',
        },
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    });
    const paginationCalc = this.paginationService.paginationCal(
      totalItems,
      paginationData.perPages,
      paginationData.currentPage,
    );
    const data = (await this.findAll({
      skip: paginationCalc.skips,
      take: paginationCalc.limit,
      where: {
        title: {
          contains: paginationData.search || '',
        },
      },
      select: {
        id: true,
        title: true,
        maxParticipant: true,
        isPublic: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        Agenda: {
          select: {
            id: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            agendaDetail: {
              select: {
                id: true,
                title: true,
                description: true,
                timeStart: true,
                timeEnd: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        participants: {
          where: {
            isPending: false,
          },
          select: {
            userId: true,
            isPending: true,
            createdAt: true,
          },
        },
        preParticipants: {
          select: {
            userId: true,
            createdAt: true,
          },
        },
        Place: {
          select: {
            name: true,
            image: true,
            description: true,
            address: true,
            contact: true,
            location: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    })) as (Trip & { Place: Place })[];
    const itemPerpage = data.length;
    const res: ResPaginationDataDto<Trip[]> = {
      totalItems: totalItems,
      itemsPerPage: itemPerpage,
      totalPages: paginationCalc.totalPages,
      currentPage: paginationData.currentPage,
      option: {
        search: paginationData.search,
        sortField: paginationData.sortField,
        sortType: paginationData.sortType,
      },
      datas: data.map((d) => ({
        ...d,
        Place: {
          ...d.Place,
          image: d.Place.image
            ? `${process.env.S3_URL}/camp/${d.Place.image}`
            : null,
        },
      })),
    };
    return res;
  }

  async ApiMyJoinedTrips(
    req: Request,
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    const tag = this.ApiMyJoinedTrips.name;
    try {
      return await this.myJoinedTrips(req, paginationData);
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async myJoinedTrips(
    req: Request,
    paginationData: PaginationDto,
  ): Promise<ResPaginationDataDto<Trip[]>> {
    const totalItems = await this.prisma.tripParticipant.count({
      where: {
        userId: req.user.sub,
        isPending: false,
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    });
    const paginationCalc = this.paginationService.paginationCal(
      totalItems,
      paginationData.perPages,
      paginationData.currentPage,
    );
    const data = (await this.prisma.tripParticipant.findMany({
      skip: paginationCalc.skips,
      take: paginationCalc.limit,
      where: {
        userId: req.user.sub,
        isPending: false,
      },
      select: {
        Trip: {
          select: {
            id: true,
            title: true,
            description: true,
            maxParticipant: true,
            isPublic: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            placeName: true,
            userId: true,
            startDate: true,
            endDate: true,
            User: {
              select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
            Agenda: {
              select: {
                id: true,
                date: true,
                createdAt: true,
                updatedAt: true,
                agendaDetail: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    timeStart: true,
                    timeEnd: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
            participants: {
              where: {
                isPending: false,
              },
              select: {
                userId: true,
                isPending: true,
                createdAt: true,
              },
            },
            preParticipants: {
              select: {
                userId: true,
                createdAt: true,
              },
            },
            Place: {
              select: {
                name: true,
                image: true,
                description: true,
                address: true,
                contact: true,
                location: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        [paginationData.sortField || 'createdAt']:
          paginationData.sortType === 'asc' ? 'asc' : 'desc',
      },
    })) as { Trip: Trip & { Place: Place } }[];
    const itemPerpage = data.length;
    const res: ResPaginationDataDto<Trip[]> = {
      totalItems: totalItems,
      itemsPerPage: itemPerpage,
      totalPages: paginationCalc.totalPages,
      currentPage: paginationData.currentPage,
      option: {
        search: paginationData.search,
        sortField: paginationData.sortField,
        sortType: paginationData.sortType,
      },
      datas: data.map((d) => ({
        ...d.Trip,
        Place: {
          ...d.Trip.Place,
          image: d.Trip.Place.image
            ? `${process.env.S3_URL}/camp/${d.Trip.Place.image}`
            : null,
        },
      })),
    };
    return res;
  }

  async ApiCreateTrip(
    req: Request,
    tripData: ReqCreateTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiCreateTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.create(tripData, req.user.sub, tripData.placeName),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async ApiUpdateTrip(
    req: Request,
    tripData: ReqUpdateTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiCreateTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.updateTrip(tripData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async updateTrip(
    tripData: ReqUpdateTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = await this.findUnique({ id: tripData.tripId });
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to update this trip',
        HttpStatus.FORBIDDEN,
      );
    }
    if (tripData.isPublic) {
      await this.update({
        where: {
          id: tripData.tripId,
        },
        data: {
          ...tripData,
          participants: {
            updateMany: {
              where: {
                isPending: true,
              },
              data: {
                isPending: false,
              },
            },
          },
        },
      });
    }
    return await this.update({
      where: {
        id: tripData.tripId,
      },
      data: {
        ...tripData,
      },
    });
  }

  async ApiDeleteTrip(req: Request, id: string): Promise<ResDataDto<Trip>> {
    const tag = this.ApiDeleteTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.deleteTrip(id, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async deleteTrip(tripId: string, userId: string): Promise<Trip> {
    const trip = await this.findUnique({ id: tripId });
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to delete this trip',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.delete({ id: tripId });
  }

  async ApiApproveMember(
    req: Request,
    approveMemberData: ReqApproveMemberOfTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiApproveMember.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.approveMember(approveMemberData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async approveMember(
    approveMemberData: ReqApproveMemberOfTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: approveMemberData.tripId },
      {
        participants: {
          select: {
            userId: true,
            isPending: true,
          },
        },
        preParticipants: {
          select: {
            userId: true,
          },
        },
        userId: true,
      },
    )) as
      | (Trip & {
          participants: TripParticipant[];
          preParticipants: PreTripParticipant[];
        })
      | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to approve this member',
        HttpStatus.FORBIDDEN,
      );
    }
    if (!trip.participants.some((p) => p.userId === approveMemberData.userId)) {
      throw new HttpException(
        'This user is not join this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.update({
      where: {
        id: approveMemberData.tripId,
      },
      data: {
        participants: {
          updateMany: {
            where: {
              userId: approveMemberData.userId,
            },
            data: {
              isPending: false,
            },
          },
        },
      },
    });
    if (
      trip.preParticipants.some((p) => p.userId === approveMemberData.userId)
    ) {
      await this.prisma.preTripParticipant.delete({
        where: {
          tripId_userId: {
            tripId: approveMemberData.tripId,
            userId: approveMemberData.userId,
          },
        },
      });
    }
    return await this.getTrip(approveMemberData.tripId);
  }

  async ApiJoinTrip(
    req: Request,
    joinTripData: ReqJoinTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiJoinTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.joinTrip(joinTripData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async joinTrip(
    joinTripData: ReqJoinTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: joinTripData.tripId },
      {
        participants: {
          select: {
            userId: true,
          },
        },
        userId: true,
      },
    )) as (Trip & { participants: TripParticipant[] }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId === userId) {
      throw new HttpException(
        'You are the owner of this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (trip.participants.some((p) => p.userId === userId)) {
      throw new HttpException(
        'You already join this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (trip.participants.length >= trip.maxParticipant) {
      throw new HttpException('Trip is full', HttpStatus.BAD_REQUEST);
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (trip.isPublic) {
      await this.update({
        where: {
          id: joinTripData.tripId,
        },
        data: {
          participants: {
            create: {
              userId: userId,
              isPending: false,
            },
          },
        },
      });
      await this.prisma.preTripParticipant.delete({
        where: {
          tripId_userId: {
            tripId: joinTripData.tripId,
            userId: userId,
          },
        },
      });
    } else {
      await this.update({
        where: {
          id: joinTripData.tripId,
        },
        data: {
          participants: {
            create: {
              userId: userId,
              isPending: true,
            },
          },
        },
      });
    }

    return await this.getTrip(joinTripData.tripId);
  }

  async ApiJoinPreTrip(
    req: Request,
    joinTripData: ReqJoinTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiJoinPreTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.joinPreTrip(joinTripData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async joinPreTrip(
    joinTripData: ReqJoinTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: joinTripData.tripId },
      {
        preParticipants: {
          select: {
            userId: true,
          },
        },
        userId: true,
      },
    )) as (Trip & { preParticipants: PreTripParticipant[] }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId === userId) {
      throw new HttpException(
        'You are the owner of this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (trip.preParticipants.some((p) => p.userId === userId)) {
      throw new HttpException(
        'You already join this trip',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.update({
      where: {
        id: joinTripData.tripId,
      },
      data: {
        preParticipants: {
          create: {
            userId: userId,
          },
        },
      },
    });
    return await this.getTrip(joinTripData.tripId);
  }

  async ApiLeaveTrip(
    req: Request,
    joinTripData: ReqLeaveTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiLeaveTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.leaveTrip(joinTripData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async leaveTrip(
    joinTripData: ReqLeaveTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: joinTripData.tripId },
      {
        participants: {
          select: {
            userId: true,
            isPending: true,
          },
        },
        userId: true,
      },
    )) as (Trip & { participants: TripParticipant[] }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    // Head of trip cant leave trip
    if (trip.userId === userId) {
      throw new HttpException(
        'You are the owner of this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!trip.participants.some((p) => p.userId === userId)) {
      throw new HttpException(
        'You are not join this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.tripParticipant.delete({
      where: {
        tripId_userId: {
          tripId: joinTripData.tripId,
          userId: userId,
        },
      },
    });
    return await this.getTrip(joinTripData.tripId);
  }

  async ApiLeavePreTrip(
    req: Request,
    joinTripData: ReqLeavePreTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiLeavePreTrip.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.leavePreTrip(joinTripData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async leavePreTrip(
    joinTripData: ReqLeavePreTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: joinTripData.tripId },
      {
        preParticipants: {
          select: {
            userId: true,
          },
        },
        userId: true,
      },
    )) as (Trip & { preParticipants: PreTripParticipant[] }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId === userId) {
      throw new HttpException(
        'You are the owner of this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!trip.preParticipants.some((p) => p.userId === userId)) {
      throw new HttpException(
        'You are not join this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.preTripParticipant.delete({
      where: {
        tripId_userId: {
          tripId: joinTripData.tripId,
          userId: userId,
        },
      },
    });
    return await this.getTrip(joinTripData.tripId);
  }

  async ApiKickMember(
    req: Request,
    kickMemberData: ReqKickMemberOfTripDataDto,
  ): Promise<ResDataDto<Trip>> {
    const tag = this.ApiKickMember.name;
    try {
      const res: ResDataDto<Trip> = {
        statusCode: EnumStatus.success,
        data: await this.kickMember(kickMemberData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async kickMember(
    kickMemberData: ReqKickMemberOfTripDataDto,
    userId: string,
  ): Promise<Trip> {
    const trip = (await this.findUnique(
      { id: kickMemberData.tripId },
      {
        participants: {
          select: {
            userId: true,
            isPending: true,
          },
        },
        userId: true,
      },
    )) as (Trip & { participants: TripParticipant[] }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to kick this member',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userId === kickMemberData.userId) {
      throw new HttpException(
        'You can not kick yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!trip.participants.some((p) => p.userId === kickMemberData.userId)) {
      throw new HttpException(
        'This user is not join this trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.tripParticipant.delete({
      where: {
        tripId_userId: {
          tripId: kickMemberData.tripId,
          userId: kickMemberData.userId,
        },
      },
    });
    return await this.getTrip(kickMemberData.tripId);
  }

  async ApiCreateAgenda(
    req: Request,
    agendaData: ReqRootAgendaDto,
  ): Promise<ResDataDto<Agenda>> {
    const tag = this.ApiCreateAgenda.name;
    try {
      const res: ResDataDto<Agenda> = {
        statusCode: EnumStatus.success,
        data: await this.createAgenda(agendaData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async createAgenda(
    agendaData: ReqRootAgendaDto,
    userId: string,
  ): Promise<Agenda> {
    const tripId = agendaData.tripId;
    const trip = (await this.findUnique(
      { id: tripId },
      {
        userId: true,
        participants: {
          select: {
            userId: true,
          },
        },
      },
    )) as (Trip & { participants: TripParticipant[] }) | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to create agenda for this trip',
        HttpStatus.FORBIDDEN,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }
    for (const agenda of agendaData.agenda) {
      const existingAgenda = await this.prisma.agenda.findFirst({
        where: {
          tripId: tripId,
          date: new Date(agenda.date),
        },
      });

      if (existingAgenda) {
        await this.prisma.agendaDetail.createMany({
          data: agenda.agendaDetail.map((detail) => ({
            title: detail.title,
            description: detail.description,
            timeStart: detail.timeStart,
            timeEnd: detail.timeEnd,
            agendaId: existingAgenda.id,
          })),
        });
      } else {
        // If the agenda for the given date does not exist, create a new agenda
        await this.prisma.agenda.create({
          data: {
            date: new Date(agenda.date),
            tripId,
            agendaDetail: {
              createMany: {
                data: agenda.agendaDetail.map((detail) => ({
                  title: detail.title,
                  description: detail.description,
                  timeStart: detail.timeStart,
                  timeEnd: detail.timeEnd,
                })),
              },
            },
          },
        });
      }
    }
    return await this.prisma.agenda.findFirst({
      where: {
        tripId: tripId,
      },
      include: {
        agendaDetail: true,
      },
    });
  }

  async ApiUpdateAgenda(
    req: Request,
    agendaData: ReqUpdateAgendaDetailsDto,
  ): Promise<ResDataDto<Agenda>> {
    const tag = this.ApiUpdateAgenda.name;
    try {
      const res: ResDataDto<Agenda> = {
        statusCode: EnumStatus.success,
        data: await this.updateAgenda(agendaData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async updateAgenda(
    agendaData: ReqUpdateAgendaDetailsDto,
    userId: string,
  ): Promise<Agenda> {
    const agenda = await this.prisma.agenda.findFirst({
      where: {
        id: agendaData.agendaId,
      },
    });

    if (!agenda) {
      throw new HttpException('Agenda not found', HttpStatus.NOT_FOUND);
    }

    const trip = (await this.findUnique(
      { id: agenda.tripId },
      {
        userId: true,
      },
    )) as Trip | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to update agenda for this trip',
        HttpStatus.FORBIDDEN,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const detail of agendaData.agendaDetail) {
      await this.prisma.agendaDetail.updateMany({
        where: {
          id: detail.agendaDetailId,
        },
        data: {
          title: detail.title,
          description: detail.description,
          timeStart: detail.timeStart,
          timeEnd: detail.timeEnd,
        },
      });
    }

    return await this.prisma.agenda.findUnique({
      where: {
        id: agenda.id,
      },
      include: {
        agendaDetail: true,
      },
    });
  }

  async ApiDeleteAgendaDetails(
    req: Request,
    agendaData: ReqDeleteAgendaDetailsDto,
  ): Promise<ResDataDto<Agenda>> {
    const tag = this.ApiDeleteAgendaDetails.name;
    try {
      const res: ResDataDto<Agenda> = {
        statusCode: EnumStatus.success,
        data: await this.deleteAgendaDetails(agendaData, req.user.sub),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw error;
    }
  }

  async deleteAgendaDetails(
    agendaData: ReqDeleteAgendaDetailsDto,
    userId: string,
  ): Promise<Agenda> {
    const agenda = await this.prisma.agenda.findFirst({
      where: {
        id: agendaData.agendaId,
      },
    });

    if (!agenda) {
      throw new HttpException('Agenda not found', HttpStatus.NOT_FOUND);
    }

    const trip = (await this.findUnique(
      { id: agenda.tripId },
      {
        userId: true,
      },
    )) as Trip | null;
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.userId !== userId) {
      throw new HttpException(
        'You are not authorized to delete agenda for this trip',
        HttpStatus.FORBIDDEN,
      );
    }
    if (
      trip.status === TripStatus.CLOSE ||
      trip.status === TripStatus.PROGRESS
    ) {
      throw new HttpException(
        'The trip has started or ended.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.agendaDetail.deleteMany({
      where: {
        id: {
          in: agendaData.agendaDetailIds,
        },
      },
    });

    return await this.prisma.agenda.findUnique({
      where: {
        id: agenda.id,
      },
    });
  }

  async create(
    data: Prisma.TripCreateInput & { agenda: ReqCreateAgendaDto[] },
    userId: string,
    placeName: string,
  ): Promise<Trip> {
    const createdTrip = await this.prisma.trip.create({
      data: {
        title: data.title,
        description: data.description,
        maxParticipant: data.maxParticipant,
        isPublic: data.isPublic,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        User: {
          connect: {
            id: userId,
          },
        },
        Place: {
          connect: {
            name: placeName,
          },
        },
      },
    });
    if (data.agenda !== undefined) {
      const agendaData = data.agenda as unknown as Prisma.AgendaCreateInput[];
      await this.prisma.agenda.createMany({
        data: agendaData.map((a) => ({
          ...a,
          tripId: createdTrip.id,
        })),
      });
    }
    return this.getTrip(createdTrip.id);
  }

  async findUnique(
    tripWhereUniqueInput: Prisma.TripWhereUniqueInput,
    select?: Prisma.TripSelect,
  ): Promise<Trip | null> {
    return await this.prisma.trip.findUnique({
      where: tripWhereUniqueInput,
      select,
    });
  }

  async find(
    tripWhereInput: Prisma.TripWhereInput,
    select?: Prisma.TripSelect,
  ): Promise<Trip | null> {
    return await this.prisma.trip.findFirst({
      where: tripWhereInput,
      select,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TripWhereUniqueInput;
    where?: Prisma.TripWhereInput;
    select?: Prisma.TripSelect;
    orderBy?: Prisma.TripOrderByWithRelationInput;
  }): Promise<Trip[]> {
    const { skip, take, cursor, where, select, orderBy } = params;
    return await this.prisma.trip.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async update(params: {
    where: Prisma.TripWhereUniqueInput;
    data: Prisma.TripUpdateInput;
  }): Promise<Trip> {
    const { where, data } = params;
    return await this.prisma.trip.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.TripWhereUniqueInput): Promise<Trip> {
    return await this.prisma.trip.delete({
      where,
    });
  }
}
