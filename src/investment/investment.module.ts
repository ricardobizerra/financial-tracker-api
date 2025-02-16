import { Module } from '@nestjs/common';
import { InvestmentResolver } from './investment.resolver';
import { InvestmentService } from './investment.service';

@Module({
  providers: [InvestmentResolver, InvestmentService],
})
export class InvestmentModule {}
