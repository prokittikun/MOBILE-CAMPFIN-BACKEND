import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, isArray } from 'class-validator';
import { ReqLoginDto } from '../requests/req-login-data.dto';

export class ResJWTDataDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
