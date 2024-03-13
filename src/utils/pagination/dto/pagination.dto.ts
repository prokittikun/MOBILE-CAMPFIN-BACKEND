import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsNotEmpty()
  perPages: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsNotEmpty()
  currentPage: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sortField: string;

  @ApiProperty({ default: 'asc' })
  @IsString()
  @IsOptional()
  sortType: string;
}
