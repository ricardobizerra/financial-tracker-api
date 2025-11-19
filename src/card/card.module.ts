import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardResolver } from './card.resolver';
import { AccountModule } from '../account/account.module';

@Module({
  providers: [CardService, CardResolver],
  exports: [CardService],
  imports: [AccountModule],
})
export class CardModule {}
