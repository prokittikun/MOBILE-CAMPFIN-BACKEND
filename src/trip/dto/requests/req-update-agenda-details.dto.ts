import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { IsValidDate } from '../../../utils/validator';
import { ReqAgendaDetailDto } from './req-create-agenda.dto';

export class SelfReqAgendaDetailDto extends PartialType(ReqAgendaDetailDto) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly agendaDetailId: string;
}

export class ReqUpdateAgendaDetailsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly agendaId: string;

  @ApiProperty({ type: [SelfReqAgendaDetailDto] })
  @IsNotEmpty()
  readonly agendaDetail: SelfReqAgendaDetailDto[];
}
