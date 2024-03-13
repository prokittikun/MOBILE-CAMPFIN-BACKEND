import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ResParticipantDataDto {
  @ApiProperty()
  @IsArray()
  readonly participants: string[];

  @ApiProperty()
  @IsArray()
  readonly preParticipants: string[];
}
