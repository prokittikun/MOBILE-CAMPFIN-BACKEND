import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class ReqCreateRewardDataDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  rewardImage: Express.Multer.File;

  @ApiProperty()
  @IsString()
  readonly description: string;
}
