import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class ReqUpdateProfileDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    name: 'profileImage',
  })
  readonly profileImage: Express.Multer.File;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;
}
