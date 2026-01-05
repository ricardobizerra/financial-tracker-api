import {
  RecurringTransaction,
  RecurrenceFrequency,
} from '@/lib/graphql/prisma-client';
import { Field, ID, ObjectType, OmitType, ArgsType } from '@nestjs/graphql';
import { Connection } from '@/utils/models/connection.model';
import { Ordenation } from '@/utils/args/ordenation.args';

@ObjectType()
export class RecurringTransactionModel extends OmitType(RecurringTransaction, [
  'user',
  'userId',
] as const) {}

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

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
