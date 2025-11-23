import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { AccountModule } from '@/account/account.module';
import { CardModule } from '@/card/card.module';

@Module({
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
  imports: [AccountModule, CardModule],
})
export class TransactionModule {}
