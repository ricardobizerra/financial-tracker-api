import { Module, forwardRef } from '@nestjs/common';
import { CardService } from './card.service';
import { CardResolver, CardBillingResolver } from './card.resolver';
import { AccountModule } from '../account/account.module';

@Module({
  providers: [CardService, CardResolver, CardBillingResolver],
  exports: [CardService],
  imports: [forwardRef(() => AccountModule)],
})
export class CardModule {}
