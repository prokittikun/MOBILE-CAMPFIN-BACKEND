import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsValidTime, IsValidDate } from '../../../utils/validator';

export class ReqAgendaDetailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @Validate(IsValidTime)
  @IsNotEmpty()
  readonly timeStart: string;

  @ApiProperty()
  @Validate(IsValidTime)
  @IsNotEmpty()
  readonly timeEnd: string;
}

export class ReqCreateAgendaDto {
  @ApiProperty()
  @Validate(IsValidDate)
  @IsNotEmpty()
  readonly date: string;

  @ApiProperty({ type: [ReqAgendaDetailDto] })
  @IsNotEmpty()
  readonly agendaDetail: ReqAgendaDetailDto[];
}

export class ReqRootAgendaDto {
  @ApiProperty({ type: [ReqCreateAgendaDto] })
  @IsArray()
  @IsNotEmpty()
  readonly agenda: ReqCreateAgendaDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly tripId: string;
}
