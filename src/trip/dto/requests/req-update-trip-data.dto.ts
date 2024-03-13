import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ReqCreateTripDataDto } from './req-create-trip-data.dto';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ReqUpdateTripDataDto extends PartialType(ReqCreateTripDataDto) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  readonly tripId: string;
}
