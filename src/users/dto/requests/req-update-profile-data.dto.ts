import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ReqUpdateProfileDataDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    name: 'profileImage',
  })
  @IsOptional()
  readonly profileImage: Express.Multer.File;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly displayName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phoneNumber: string;
}
