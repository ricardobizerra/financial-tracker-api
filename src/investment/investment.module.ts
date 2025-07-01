import { Module } from '@nestjs/common';
import { InvestmentResolver } from './investment.resolver';
import { InvestmentService } from './investment.service';
import { IpeadataModule } from '@/external/ipeadata/ipeadata.module';

@Module({
  imports: [IpeadataModule],
  providers: [InvestmentResolver, InvestmentService],
})
export class InvestmentModule {}
