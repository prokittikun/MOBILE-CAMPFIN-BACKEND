import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, IsUUID } from 'class-validator';

export class ResUserDataDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  readonly profileImage: string;
}
