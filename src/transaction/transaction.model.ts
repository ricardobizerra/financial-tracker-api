import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '@/lib/graphql/prisma-client';
import {
  Field,
  ID,
  Int,
  ObjectType,
  OmitType,
  ArgsType,
} from '@nestjs/graphql';
import { Connection } from '@/utils/models/connection.model';
import { Ordenation } from '@/utils/args/ordenation.args';

@ObjectType()
export class TransactionModel extends OmitType(Transaction, [
  'user',
  'userId',
] as const) {
  @Field(() => Boolean, { nullable: true })
  canCancel?: boolean;

  @Field(() => String, { nullable: true })
  cancelReason?: string;

  @Field(() => String, { nullable: true })
  cancelWarningMessage?: string;

  @Field(() => Date, { nullable: true })
  installmentStartDate?: Date;

  @Field(() => Int, { nullable: true })
  installmentNumber?: number | null;

  @Field(() => Int, { nullable: true })
  totalInstallments?: number | null;

  @Field(() => String, { nullable: true })
  installmentId?: string | null;
}

@ObjectType()
export class TransactionConnection extends Connection(TransactionModel) {}

@ArgsType()
export class OrdenationTransactionArgs extends Ordenation(TransactionModel, [
  'id',
]) {}

@ArgsType()
export class TransactionFilterArgs {
  @Field(() => ID, { nullable: true })
  accountId?: string;

  @Field(() => ID, { nullable: true })
  cardBillingId?: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => [TransactionType], { nullable: true })
  types?: TransactionType[];

  @Field(() => [TransactionStatus], { nullable: true })
  statuses?: TransactionStatus[];
}
