import { Module } from '@nestjs/common';
import { InvestmentResolver } from './investment.resolver';
import { InvestmentService } from './investment.service';
import { IpeadataModule } from '@/external/ipeadata/ipeadata.module';
import { BacenModule } from '@/external/bacen/bacen.module';
import { AccountModule } from '@/account/account.module';
import { TransactionModule } from '@/transaction/transaction.module';

@Module({
  imports: [IpeadataModule, BacenModule, AccountModule, TransactionModule],
  providers: [InvestmentResolver, InvestmentService],
})
export class InvestmentModule {}
