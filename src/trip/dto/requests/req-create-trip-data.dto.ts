import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ReqCreateAgendaDto } from './req-create-agenda.dto';

export class ReqCreateTripDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly maxParticipant: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly placeName: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isPublic: boolean;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly endDate: string;

  @ApiProperty({ type: [ReqCreateAgendaDto] })
  @IsArray()
  // @IsNotEmpty()
  @IsOptional()
  readonly agenda: ReqCreateAgendaDto[];
}
