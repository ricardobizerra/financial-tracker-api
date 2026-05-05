import {
  RecurringTransaction,
  RecurrenceFrequency,
} from '@/lib/graphql/prisma-client';
import {
  Field,
  ID,
  ObjectType,
  OmitType,
  ArgsType,
  Int,
} from '@nestjs/graphql';
import { Connection } from '@/utils/models/connection.model';
import { Ordenation } from '@/utils/args/ordenation.args';

import { TransactionModel } from '@/transaction/transaction.model';

@ObjectType()
export class RecurringTransactionSuggestion {
  @Field()
  description: string;

  @Field()
  averageAmount: number;

  @Field(() => RecurrenceFrequency)
  frequency: RecurrenceFrequency;

  @Field(() => Int, { nullable: true })
  suggestedDay?: number;

  @Field(() => ID, { nullable: true })
  sourceAccountId?: string;

  @Field(() => ID, { nullable: true })
  destinyAccountId?: string;

  @Field(() => [ID])
  transactionIds: string[];

  @Field(() => [TransactionModel])
  transactions: TransactionModel[];

  @Field(() => Int)
  occurrenceCount: number;
}

@ObjectType()
export class RecurringTransactionModel extends OmitType(RecurringTransaction, [
  'user',
  'userId',
  'transactions',
] as const) {
  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[];
}

@ObjectType()
export class RecurringTransactionConnection extends Connection(
  RecurringTransactionModel,
) {}

@ArgsType()
export class OrdenationRecurringTransactionArgs extends Ordenation(
  RecurringTransactionModel,
  ['id'],
) {}

@ArgsType()
export class RecurringTransactionFilterArgs {
  @Field(() => ID, { nullable: true })
  accountId?: string;

  @Field(() => ID, { nullable: true })
  cardId?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
