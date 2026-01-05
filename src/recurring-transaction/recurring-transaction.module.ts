import { Module } from '@nestjs/common';
import { RecurringTransactionResolver } from './recurring-transaction.resolver';
import { RecurringTransactionService } from './recurring-transaction.service';
import { CardModule } from '@/card/card.module';

@Module({
  providers: [RecurringTransactionResolver, RecurringTransactionService],
  exports: [RecurringTransactionService],
  imports: [CardModule],
})
export class RecurringTransactionModule {}
