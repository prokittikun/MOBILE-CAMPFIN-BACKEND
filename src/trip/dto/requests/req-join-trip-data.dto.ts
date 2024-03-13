import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReqJoinTripDataDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly tripId: string;
}
