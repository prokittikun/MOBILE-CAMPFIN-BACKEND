import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ReqCreateTripDataDto } from './req-create-trip-data.dto';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ReqDeleteAgendaDetailsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly agendaId: string;

  @ApiProperty()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  @IsOptional()
  readonly agendaDetailIds: string[];
}
