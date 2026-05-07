import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import type { Response, Request } from 'express';
import { AuthRefreshTokenGuard } from './authrefreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @Post('login')
  async login(
    @Body() loginAuthDto: loginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.login(loginAuthDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }
  @UseGuards(AuthRefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const accessToken = await this.authService.refresh(req.user!);
    return { accessToken };
  }
}
