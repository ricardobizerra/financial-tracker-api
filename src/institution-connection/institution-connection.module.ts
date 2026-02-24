import { Module } from '@nestjs/common';
import { InstitutionConnectionResolver } from './institution-connection.resolver';
import { InstitutionConnectionService } from './institution-connection.service';

@Module({
  providers: [InstitutionConnectionResolver, InstitutionConnectionService],
})
export class InstitutionConnectionModule {}
