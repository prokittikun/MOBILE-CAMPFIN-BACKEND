import { PartialType } from '@nestjs/swagger';
import { ReqCreatePlaceDataDto } from './req-create-place-data.dto';

export class ReqUpdatePlaceDataDto extends PartialType(ReqCreatePlaceDataDto) {}
