import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { Request, Response } from 'express';
import { Roles } from '../../common/guards/roles/roles.decorator';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { userRoleEnum } from '../user/user.schema';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async create(@Body() createAuthDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(createAuthDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(HttpStatus.OK)
      .json({ success: true, accessToken, refreshToken });
  }

  @UseGuards(RolesGuard)
  @Roles(...Object.values(userRoleEnum.enumValues))
  @Get('me')
  async me(@Req() req: Request) {
    return await this.authService.me(req.user.sub);
  }

  @Get('refresh-token')
  async refreshToken(token: string, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(token);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(HttpStatus.OK).json({ accessToken, refreshToken });
  }
}
