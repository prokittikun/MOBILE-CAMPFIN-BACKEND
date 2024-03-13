import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResPlaceDataDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly image: string;

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
  @IsNumber()
  readonly latitude: number;

  @ApiProperty()
  @IsNumber()
  readonly longitude: number;

  @ApiProperty()
  @IsString()
  readonly createdAt: string;

  @ApiProperty()
  @IsString()
  readonly updatedAt: string;
}
