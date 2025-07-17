import { Module } from '@nestjs/common';
import { InvestmentResolver } from './investment.resolver';
import { InvestmentService } from './investment.service';
import { IpeadataModule } from '@/external/ipeadata/ipeadata.module';
import { BacenModule } from '@/external/bacen/bacen.module';

@Module({
  imports: [IpeadataModule, BacenModule],
  providers: [InvestmentResolver, InvestmentService],
})
export class InvestmentModule {}
