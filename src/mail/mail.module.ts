import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { MAIL_QUEUE } from './mail.constants';

@Module({
  imports: [BullModule.registerQueue({ name: MAIL_QUEUE }), JwtModule],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
