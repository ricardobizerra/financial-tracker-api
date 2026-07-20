import { Module, forwardRef } from '@nestjs/common';
import { InstitutionLinkResolver } from './institution-link.resolver';
import { InstitutionLinkService } from './institution-link.service';
import { AccountModule } from '@/account/account.module';

@Module({
  providers: [InstitutionLinkResolver, InstitutionLinkService],
  exports: [InstitutionLinkService],
  imports: [forwardRef(() => AccountModule)],
})
export class InstitutionLinkModule {}
