import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ApiOkResponseData } from 'src/decorator/ApiOkResponse.decorator';
import { AuthenticationService } from './authentication.service';
import { ReqGoogleLoginDataDto } from './dto/requests/req-google-login-data.dto';
import { ReqGoogleProfileDataDto } from './dto/requests/req-google-profile-data.dto';
import { ReqLoginDto } from './dto/requests/req-login-data.dto';
import { ReqRegisterDto } from './dto/requests/req-register-data.dto';
import { ResDataDto } from '../DTO/res-data.dto';
import { ResJWTDataDto } from './dto/responses/res-jwt-data.dto';
import { Public } from './reflector';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  // @ApiOkResponseData()
  signUp(@Body() registerDto: ReqRegisterDto): Promise<ResDataDto<User>> {
    return this.authenticationService.ApiSignUp(registerDto);
  }

  @Post('login')
  @ApiOkResponseData(ResJWTDataDto)
  signIn(@Body() loginDto: ReqLoginDto): Promise<ResDataDto<ResJWTDataDto>> {
    return this.authenticationService.ApiSignIn(loginDto);
  }

  @Post('login-google')
  @ApiOkResponseData(ResJWTDataDto)
  async googleLogin(
    @Body() googleLoginData: ReqGoogleLoginDataDto,
  ): Promise<ResDataDto<ResJWTDataDto>> {
    return this.authenticationService.ApiLoginWithGoogle(googleLoginData);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return;
  }

  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    //: Promise<ResDataDto<ResJWTDataDto>>
    const { profile } = req.user;
    const data = profile as ReqGoogleProfileDataDto;
    const resp = await this.authenticationService.ApiLoginWithGoogleRedirect(
      data,
    );

    if (req.headers['user-agent'].includes('Mobile')) {
      console.log(req.headers['referer'], req.headers['user-agent']);

      return res.redirect(
        `com.campfin.app://data?status=${resp.statusCode}&token=${resp.data.accessToken}`,
      );
    } else {
      return res.redirect(
        `http://localhost:5173/login?status=${resp.statusCode}&token=${resp.data.accessToken}`,
      );
    }
  }
}
