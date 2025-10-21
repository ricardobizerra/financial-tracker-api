import { UserService } from '@/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { SignIn } from './models/sign-in.model';
import { userWithoutPassword } from '@/utils/user-without-password';
import { UserModel } from '@/user/models/user.model';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  async validateEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserModel> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordCheck = await compare(password, user?.password);

    if (!passwordCheck) {
      throw new UnauthorizedException();
    }

    return userWithoutPassword(user);
  }

  async validateUserId(id: string): Promise<UserModel> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return userWithoutPassword(user);
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    user: UserModel;
  }> {
    const user = await this.validateEmailAndPassword(email, password);

    const payload = {
      sub: user.id,
      ...user,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }

  async signInOAuth(userId: string): Promise<{ accessToken: string }> {
    const user = await this.validateUserId(userId);

    const payload = {
      sub: userId,
      ...user,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN_SECONDS', {
        infer: true,
      }),
    });

    return {
      accessToken,
    };
  }

  setTokenCookie(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, {
      maxAge:
        this.configService.get('JWT_EXPIRES_IN_SECONDS', { infer: true }) *
        1000,
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      signed: false,
    });
  }

  clearTokenCookie(res: Response) {
    res.clearCookie('accessToken', {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      signed: false,
    });
  }
}
