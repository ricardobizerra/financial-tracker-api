import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthSignInInput } from './models/sign-in-input.model';
import { SignIn } from './models/sign-in.model';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService<Env, true>,
  ) {}

  @Mutation(() => SignIn, { name: 'authSignIn' })
  async signIn(
    @Args('data') data: AuthSignInInput,
    @Context('req') req: Request,
    @Context('res') res: Response,
  ) {
    const { accessToken, user } = await this.authService.signIn(
      data.username,
      data.password,
    );

    res.cookie('accessToken', accessToken, {
      maxAge:
        this.configService.get('JWT_EXPIRES_IN_SECONDS', { infer: true }) *
        1000,
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      signed: false,
    });

    return {
      user,
    };
  }
}
