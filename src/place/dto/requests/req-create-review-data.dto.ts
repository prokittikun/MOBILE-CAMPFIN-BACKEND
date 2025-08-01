import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ReqCreateReviewDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly rating: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly placeName: string;
}
