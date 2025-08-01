import { JwtPayload } from './authentication/interfaces/JwtPayload.interface';
import { ReqGoogleProfileDataDto } from './authentication/dto/requests/req-google-profile-data.dto';
declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
