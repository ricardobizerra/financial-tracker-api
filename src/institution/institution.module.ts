import { Module } from '@nestjs/common';
import { InstitutionResolver } from './institution.resolver';
import { InstitutionService } from './institution.service';

@Module({
  providers: [InstitutionResolver, InstitutionService],
})
export class InstitutionModule {}
