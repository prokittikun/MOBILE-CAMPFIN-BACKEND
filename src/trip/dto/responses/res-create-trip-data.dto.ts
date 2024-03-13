import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ResAgendaDto } from './res-agenda-data.dto';
import { ResUserDataDto } from './res-user-data.dto';
import { ResPlaceDataDto } from '../../../place/dto/responses/res-place-data.dto';

export class ResCreateTripDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

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
  @IsBoolean()
  @IsNotEmpty()
  readonly isPublic: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly endDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: string;

  @ApiProperty({ type: ResUserDataDto })
  @IsNotEmpty()
  readonly user: ResUserDataDto;

  @ApiProperty({
    type: [ResAgendaDto],
  })
  @IsArray()
  readonly agenda: ResAgendaDto[];

  @ApiProperty()
  @IsArray()
  readonly participants: string[];

  @ApiProperty()
  @IsArray()
  readonly preParticipants: string[];

  @ApiProperty({ type: ResPlaceDataDto })
  readonly place: ResPlaceDataDto;
}
