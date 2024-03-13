import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class ReqCreatePlaceDataDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  placeImage: Express.Multer.File;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsString()
  readonly contact: string;

  @ApiProperty()
  @IsString()
  readonly location: string;

  @ApiProperty()
  @IsNumberString()
  latitude: string;

  @ApiProperty()
  @IsNumberString()
  longitude: string;
}
