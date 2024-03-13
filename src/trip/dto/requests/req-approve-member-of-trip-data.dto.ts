import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class ReqApproveMemberOfTripDataDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly tripId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;
}
