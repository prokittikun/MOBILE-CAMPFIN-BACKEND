import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResAgendaDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly date: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly agendaDetail: ResAgendaDetailDto[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: string;
}

export class ResAgendaDetailDto {
  @ApiProperty()
  @IsUUID()
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

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly timeStart: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly timeEnd: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly tripId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: string;
}
