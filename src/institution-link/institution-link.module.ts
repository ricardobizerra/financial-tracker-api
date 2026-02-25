import { Module } from '@nestjs/common';
import { InstitutionLinkResolver } from './institution-link.resolver';
import { InstitutionLinkService } from './institution-link.service';

@Module({
  providers: [InstitutionLinkResolver, InstitutionLinkService],
  exports: [InstitutionLinkService],
})
export class InstitutionLinkModule {}
