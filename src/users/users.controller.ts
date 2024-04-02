import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ReqUpdateProfileDataDto } from './dto/requests/req-update-profile-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../utils/validator';
import { Request } from 'express';
import { AuthGuard } from '../authentication/authentication.guard';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('profileImage', { fileFilter: imageFileFilter }),
  )
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: ReqUpdateProfileDataDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return await this.usersService.ApiUpdateProfile(
      req,
      updateUserDto,
      profileImage,
    );
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.usersService.ApiGetProfile(req);
  }
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
