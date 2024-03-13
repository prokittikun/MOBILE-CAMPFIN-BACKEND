import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { ReqApproveMemberOfTripDataDto } from './req-approve-member-of-trip-data.dto';

export class ReqKickMemberOfTripDataDto extends PartialType(
  ReqApproveMemberOfTripDataDto,
) {}
