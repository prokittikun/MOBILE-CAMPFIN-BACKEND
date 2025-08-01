import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResPaginationDataOptionDto {
  @ApiProperty()
  @IsString()
  readonly sortField: string;

  @ApiProperty()
  @IsString()
  readonly sortType: string;

  @ApiProperty()
  @IsString()
  readonly search: string;
}

export class ResPaginationDataDto<T> {
  @ApiProperty()
  @IsNumber()
  readonly totalItems: number;

  @ApiProperty()
  @IsNumber()
  readonly itemsPerPage: number;

  @ApiProperty()
  @IsNumber()
  readonly totalPages: number;

  @ApiProperty()
  @IsNumber()
  readonly currentPage: number;

  @ApiProperty()
  readonly option: ResPaginationDataOptionDto;

  @ApiProperty({ type: Object })
  readonly datas: T;
}
