import {
  InstitutionConnection,
  InstitutionType,
} from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import { Field, ObjectType, OmitType, ArgsType } from '@nestjs/graphql';

@ObjectType()
export class InstitutionConnectionModel extends OmitType(
  InstitutionConnection,
  ['user', 'userId'] as const,
) {}

@ObjectType()
export class InstitutionConnectionConnection extends Connection(
  InstitutionConnectionModel,
) {}

@ArgsType()
export class OrdenationInstitutionConnectionArgs extends Ordenation(
  InstitutionConnectionModel,
  ['id', 'createdAt', 'updatedAt'],
) {}

@ArgsType()
export class InstitutionConnectionFilterArgs {
  @Field(() => [InstitutionType], { nullable: true })
  institutionTypes?: InstitutionType[];
}
