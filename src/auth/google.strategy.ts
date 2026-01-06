import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UserService } from '@/user/user.service';
import { userWithoutPassword } from '@/utils/user-without-password';
import { Env } from '@/env';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    readonly configService: ConfigService<Env, true>,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', { infer: true }),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', { infer: true }),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL', { infer: true }),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any, // TODO: create google profile type
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = await this.userService.findByEmail(emails[0].value);

    if (!user) {
      const user = await this.userService.create({
        name: `${name.givenName} ${name.familyName}`,
        email: emails[0].value,
        role: 'USER',
        authUserProviders: {
          create: [
            {
              providerName: 'GOOGLE',
              providerId: id,
            },
          ],
        },
        // TODO: add imageUrl on user model
        // picture: photos[0].value,
      });

      return done(null, userWithoutPassword(user));
    }

    if (
      !user.authUserProviders.some((provider) => provider.providerId === id)
    ) {
      await this.userService.update(user.id, {
        authUserProviders: {
          create: [
            {
              providerName: 'GOOGLE',
              providerId: id,
            },
          ],
        },
      });
    }

    return done(null, userWithoutPassword(user));
  }
}
