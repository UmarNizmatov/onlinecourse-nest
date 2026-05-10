import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import type { Response, Request } from 'express';
import { AuthRefreshTokenGuard } from './authrefreshToken.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginAuthDto: loginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken, user } =
      await this.authService.login(loginAuthDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, user };
  }

  @Public()
  @UseGuards(AuthRefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const accessToken = await this.authService.refresh(req.user!);
    return { accessToken };
  }

  @Get('teachers')
  getTeachers() {
    return this.authService.getTeachers();
  }
}
