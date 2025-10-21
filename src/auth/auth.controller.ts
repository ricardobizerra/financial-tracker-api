import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { GoogleOAuthGuard } from '@/auth/google.guard';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<Env, true>,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.signInOAuth(
      (req.user as Pick<User, 'id'>)?.id,
    );

    this.authService.setTokenCookie(res, accessToken);

    return res.redirect(
      this.configService.get('FRONTEND_URL', { infer: true }),
    );
  }
}
