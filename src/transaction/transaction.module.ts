import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { AccountModule } from '@/account/account.module';

@Module({
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
  imports: [AccountModule],
})
export class TransactionModule {}
