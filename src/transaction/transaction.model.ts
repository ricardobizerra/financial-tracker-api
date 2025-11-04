import { Transaction, TransactionType } from '@/lib/graphql/prisma-client';
import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { Connection } from '@/utils/models/connection.model';
import { ArgsType } from '@nestjs/graphql';
import { Ordenation } from '@/utils/args/ordenation.args';

@ObjectType()
export class TransactionModel extends OmitType(Transaction, [
  'user',
  'userId',
] as const) {}

@ObjectType()
export class TransactionConnection extends Connection(TransactionModel) {}

@ArgsType()
export class OrdenationTransactionArgs extends Ordenation(TransactionModel, [
  'id',
]) {}

@ArgsType()
export class TransactionFilterArgs {
  @Field(() => ID, { nullable: true })
  accountId: string;
}
