import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { EnumStatus } from '../enum/status.enum';
import { UsersService } from '../users/users.service';
import { LogService } from '../utils/log/log.service';
import { ReqGoogleLoginDataDto } from './dto/requests/req-google-login-data';
import { ReqLoginDto } from './dto/requests/req-login-data.dto';
import { ReqRegisterDto } from './dto/requests/req-register-data.dto';
import { ResDataDto } from './dto/responses/res-data.dto';
import { ResJWTDataDto } from './dto/responses/res-jwt-data.dto';
import { ReqGoogleProfileDataDto } from './dto/requests/req-google-profile-data';

@Injectable()
export class AuthenticationService {
  private logger = new LogService(AuthenticationService.name);
  private google: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.google = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async ApiLoginWithGoogle(
    googleLoginData: ReqGoogleLoginDataDto,
  ): Promise<ResDataDto<ResJWTDataDto>> {
    const tag = this.ApiLoginWithGoogle.name;
    try {
      const res: ResDataDto<ResJWTDataDto> = {
        statusCode: EnumStatus.success,
        data: await this.loginWithGoogle(googleLoginData),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginWithGoogle(
    googleLoginData: ReqGoogleLoginDataDto,
  ): Promise<ResJWTDataDto> {
    const tag = this.loginWithGoogle.name;
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: googleLoginData.token,
        audience: [process.env.GOOGLE_CLIENT_ID],
      });
      const data = ticket.getPayload();

      if (!data) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      let user = await this.usersService.find({ email: data.email });
      if (!user) {
        const userData = {
          username: 'google_' + data.name + '_' + data.sub,
          email: data.email,
          password: bcrypt.hashSync(data.sub, 10),
        };
        user = await this.usersService.create(userData);
        if (!user) {
          throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
        }
      }
      const payload = {
        username: user.username,
        sub: user.id,
      };
      const accessToken = await this.signJWT(payload);
      return { accessToken };
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ApiLoginWithGoogleRedirect(
    profile: ReqGoogleProfileDataDto,
  ): Promise<ResDataDto<ResJWTDataDto>> {
    const tag = this.ApiLoginWithGoogleRedirect.name;
    try {
      const res: ResDataDto<ResJWTDataDto> = {
        statusCode: EnumStatus.success,
        data: await this.loginWithGoogleRedirect(profile),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginWithGoogleRedirect(
    profile: ReqGoogleProfileDataDto,
  ): Promise<ResJWTDataDto> {
    const tag = this.loginWithGoogleRedirect.name;
    try {
      let user = await this.usersService.findUnique({
        email: profile.emails[0].value,
      });
      if (!user) {
        const userData = {
          username: 'google_' + profile.displayName + '_' + profile.id,
          email: profile.emails[0].value,
          password: bcrypt.hashSync(profile.id, 10),
        };
        user = await this.usersService.create(userData);
        if (!user) {
          throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
        }
      }
      const payload = {
        username: user.username,
        sub: user.id,
      };
      const accessToken = await this.signJWT(payload);
      return { accessToken };
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ApiSignUp(registerDto: ReqRegisterDto): Promise<ResDataDto<User>> {
    const tag = this.ApiSignUp.name;
    try {
      const res: ResDataDto<User> = {
        statusCode: EnumStatus.created,
        data: await this.signUp(registerDto),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signUp(registerDto: ReqRegisterDto): Promise<User> {
    const tag = this.signUp.name;
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const userData = {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      };
      console.log('userData', userData);

      const res = await this.usersService.create(userData);
      if (!res) {
        throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
      }
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ApiSignIn(loginDto: ReqLoginDto): Promise<ResDataDto<ResJWTDataDto>> {
    const tag = this.ApiSignIn.name;
    try {
      const res: ResDataDto<ResJWTDataDto> = {
        statusCode: EnumStatus.success,
        data: await this.signIn(loginDto),
        message: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(loginDto: ReqLoginDto): Promise<ResJWTDataDto> {
    const tag = this.signIn.name;
    try {
      const user = await this.usersService.find(
        {
          username: loginDto.username,
        },
        { id: true, password: true },
      );
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const payload = {
        username: user.username,
        sub: user.id,
      };
      return {
        accessToken: await this.signJWT(payload),
      };
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signJWT(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
