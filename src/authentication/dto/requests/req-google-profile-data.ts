import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

class ReqGoogleProfileEmailDataDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly value: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly verified: boolean;
}

class ReqGoogleProfilePhotoDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class ReqGoogleProfileDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: [ReqGoogleProfileEmailDataDto] })
  @IsNotEmpty()
  @IsArray()
  readonly emails: [ReqGoogleProfileEmailDataDto];

  @ApiProperty({ type: [ReqGoogleProfilePhotoDataDto] })
  @IsNotEmpty()
  @IsArray()
  readonly photos: [ReqGoogleProfilePhotoDataDto];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly provider: string;
}
