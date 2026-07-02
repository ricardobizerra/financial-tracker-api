import { Module } from '@nestjs/common';
import { InvestmentResolver } from './investment.resolver';
import { InvestmentService } from './investment.service';
import { IpeadataModule } from '@/external/ipeadata/ipeadata.module';
import { BacenModule } from '@/external/bacen/bacen.module';
import { TesouroTransparenteModule } from '@/external/tesouro-transparente/tesouro-transparente.module';
import { AccountModule } from '@/account/account.module';
import { TransactionModule } from '@/transaction/transaction.module';
import { InstitutionLinkModule } from '@/institution-link/institution-link.module';

@Module({
  imports: [
    IpeadataModule,
    BacenModule,
    TesouroTransparenteModule,
    AccountModule,
    TransactionModule,
    InstitutionLinkModule,
  ],
  providers: [InvestmentResolver, InvestmentService],
})
export class InvestmentModule {}
