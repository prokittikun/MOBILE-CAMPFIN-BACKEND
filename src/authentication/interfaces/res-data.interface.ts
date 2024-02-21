import { User } from '@prisma/client';
import { EnumStatus } from '../../enum/status.enum';
import { ResJWTData } from './res-jwt-data.interface';

export interface ResData<T> {
  statusCode: EnumStatus;
  message: string;
  data: T;
  error?: string;
}
