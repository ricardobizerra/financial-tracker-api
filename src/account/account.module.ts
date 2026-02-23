import { Module, forwardRef } from '@nestjs/common';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { CardModule } from '@/card/card.module';

@Module({
  providers: [AccountResolver, AccountService],
  exports: [AccountService],
  imports: [forwardRef(() => CardModule)],
})
export class AccountModule {}
