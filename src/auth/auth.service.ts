import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { userWithoutPassword } from '@/utils/user-without-password';
import { UserModel } from '@/user/models/user.model';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';
import { MailService } from '@/mail/mail.service';

interface PasswordResetPayload {
  sub: string;
  purpose: 'password-reset';
}

@Injectable()
export class AuthService {
  private readonly PASSWORD_RESET_EXPIRES_IN = '1h';

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
    private readonly mailService: MailService,
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
    const isProduction =
      this.configService.get('NODE_ENV', { infer: true }) === 'production';

    res.cookie('accessToken', accessToken, {
      maxAge:
        this.configService.get('JWT_EXPIRES_IN_SECONDS', { infer: true }) *
        1000,
      sameSite: isProduction ? 'none' : 'strict',
      secure: true,
      httpOnly: true,
      signed: false,
    });
  }

  clearTokenCookie(res: Response) {
    const isProduction =
      this.configService.get('NODE_ENV', { infer: true }) === 'production';

    res.clearCookie('accessToken', {
      sameSite: isProduction ? 'none' : 'strict',
      secure: true,
      httpOnly: true,
      signed: false,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    // Silent fail para não revelar se email existe
    if (!user) return;

    // Gerar token JWT com propósito específico
    const token = await this.jwtService.signAsync(
      { sub: user.id, purpose: 'password-reset' } as PasswordResetPayload,
      { expiresIn: this.PASSWORD_RESET_EXPIRES_IN },
    );

    // Publicar job de email na fila
    await this.mailService.sendPasswordResetEmail({
      email,
      token,
      name: user.name,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload: PasswordResetPayload;

    try {
      payload = await this.jwtService.verifyAsync<PasswordResetPayload>(token);
    } catch {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Validar que o token é especificamente para reset de senha
    if (payload.purpose !== 'password-reset') {
      throw new BadRequestException('Token inválido');
    }

    // Verificar se o usuário existe
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Hash da nova senha
    const hashedPassword = await hash(newPassword, 10);

    // Atualizar senha diretamente no banco
    await this.usersService.updatePassword(user.id, hashedPassword);
  }
}
