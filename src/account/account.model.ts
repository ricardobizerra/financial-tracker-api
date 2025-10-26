import { Account, AccountType } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import { Field, ObjectType, OmitType, ArgsType } from '@nestjs/graphql';

@ObjectType()
export class AccountModel extends OmitType(Account, [
  'user',
  'userId',
] as const) {}

@ObjectType()
export class AccountConnection extends Connection(AccountModel) {}

@ArgsType()
export class OrdenationAccountArgs extends Ordenation(AccountModel, [
  'id',
  'description',
]) {}
