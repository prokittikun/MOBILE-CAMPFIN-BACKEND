import { PartialType } from '@nestjs/swagger';
import { ReqJoinTripDataDto } from './req-join-trip-data.dto';

export class ReqLeavePreTripDataDto extends PartialType(ReqJoinTripDataDto) {}
