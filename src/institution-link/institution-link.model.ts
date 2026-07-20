import { AccountModel } from '@/account/account.model';
import { InstitutionLink, InstitutionType } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import {
  Field,
  ObjectType,
  OmitType,
  ArgsType,
  InputType,
} from '@nestjs/graphql';

@InputType()
export class CreateInstitutionLinkInput {
  @Field()
  institutionId: string;
}

@ObjectType()
export class InstitutionLinkModel extends OmitType(InstitutionLink, [
  'user',
  'userId',
] as const) {
  @Field(() => AccountModel, { nullable: true })
  account?: AccountModel | null;
}

@ObjectType()
export class InstitutionLinkConnection extends Connection(
  InstitutionLinkModel,
) {}

@ArgsType()
export class OrdenationInstitutionLinkArgs extends Ordenation(
  InstitutionLinkModel,
  ['id', 'createdAt', 'updatedAt'],
) {}

@ArgsType()
export class InstitutionLinkFilterArgs {
  @Field(() => [InstitutionType], { nullable: true })
  institutionTypes?: InstitutionType[];
}
