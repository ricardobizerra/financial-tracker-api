import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  MAIL_QUEUE,
  MailJobType,
  PasswordResetJobData,
} from './mail.constants';

@Injectable()
export class MailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  async sendPasswordResetEmail(data: PasswordResetJobData): Promise<void> {
    await this.mailQueue.add(MailJobType.PASSWORD_RESET, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
