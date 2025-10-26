import { Institution } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import { ObjectType, OmitType, ArgsType } from '@nestjs/graphql';

@ObjectType()
export class InstitutionModel extends OmitType(Institution, [
  '_count',
] as const) {}

@ObjectType()
export class InstitutionConnection extends Connection(InstitutionModel) {}

@ArgsType()
export class OrdenationInstitutionArgs extends Ordenation(InstitutionModel) {}
