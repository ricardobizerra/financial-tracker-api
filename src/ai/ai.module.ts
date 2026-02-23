import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiResolver } from './ai.resolver';
import { TransactionModule } from '@/transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  providers: [AiService, AiResolver],
  exports: [AiService],
})
export class AiModule {}
