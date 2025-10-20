import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthSignInInput } from './models/sign-in-input.model';
import { SignIn } from './models/sign-in.model';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignIn, { name: 'authSignIn' })
  async signIn(
    @Args('data') data: AuthSignInInput,
    @Context('res') res: Response,
  ) {
    const { accessToken, user } = await this.authService.signIn(
      data.username,
      data.password,
    );

    this.authService.setTokenCookie(res, accessToken);

    return {
      user,
    };
  }

  @Mutation(() => Boolean, { name: 'authSignOut' })
  async signOut(@Context('res') res: Response): Promise<boolean> {
    this.authService.clearTokenCookie(res);
    return true;
  }
}
