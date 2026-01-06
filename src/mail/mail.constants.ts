export const MAIL_QUEUE = 'mail';

export enum MailJobType {
  PASSWORD_RESET = 'password-reset',
}

export interface PasswordResetJobData {
  email: string;
  token: string;
  name: string;
}
