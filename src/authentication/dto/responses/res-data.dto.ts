import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnumStatus } from '../../../enum/status.enum';
import { ResJWTDataDto } from './res-jwt-data.dto';

export class ResDataDto<T> {
  @ApiProperty({ enum: EnumStatus })
  @IsNotEmpty()
  readonly statusCode: EnumStatus;

  @ApiProperty()
  @IsString()
  readonly message: string;

  @ApiProperty({ type: Object })
  readonly data: T;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly error?: string;
}
