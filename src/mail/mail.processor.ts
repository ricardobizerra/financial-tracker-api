import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MAIL_QUEUE,
  MailJobType,
  PasswordResetJobData,
} from './mail.constants';
import { Env } from '@/env';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  private readonly resend: Resend;
  private readonly frontendUrl: string;
  private readonly fromEmail: string;

  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly jwtService: JwtService,
  ) {
    super();
    this.resend = new Resend(configService.get('RESEND_API_KEY'));
    this.frontendUrl = configService.get('FRONTEND_URL');
    this.fromEmail = configService.get('MAIL_FROM_EMAIL');
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case MailJobType.PASSWORD_RESET:
        await this.handlePasswordReset(job.data);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handlePasswordReset(data: PasswordResetJobData): Promise<void> {
    // Verificar se o token ainda é válido antes de enviar
    try {
      await this.jwtService.verifyAsync(data.token);
    } catch {
      this.logger.warn(
        `Skipping password reset email for ${data.email}: token has expired`,
      );
      return;
    }

    const resetUrl = `${this.frontendUrl}/reset-password?token=${data.token}`;

    const { error } = await this.resend.emails.send({
      from: `FinancialTracker <${this.fromEmail}>`,
      to: data.email,
      subject: 'Recuperação de Senha - FinancialTracker',
      html: this.getPasswordResetHtml(data.name, resetUrl),
    });

    if (error) {
      this.logger.error(
        `Failed to send password reset email: ${error.message}`,
      );
      throw new Error(error.message);
    }

    this.logger.log(`Password reset email sent to ${data.email}`);
  }

  private getPasswordResetHtml(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">FinancialTracker</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Olá, ${name}!</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Este link expira em <strong>1 hora</strong>.</p>
          <p style="color: #666; font-size: 14px;">Se você não solicitou a redefinição de senha, ignore este email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Se o botão não funcionar, copie e cole este link no seu navegador:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </body>
      </html>
    `;
  }
}
