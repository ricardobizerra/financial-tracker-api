import { Field, ObjectType, registerEnumType, Int } from '@nestjs/graphql';
import { TransactionModel } from './transaction.model';

export enum TransactionPeriod {
  OVERDUE = 'OVERDUE',
  TODAY = 'TODAY',
  THIS_WEEK = 'THIS_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  NEXT_MONTH = 'NEXT_MONTH',
  FUTURE = 'FUTURE',
  PAST = 'PAST',
}

registerEnumType(TransactionPeriod, {
  name: 'TransactionPeriod',
  description: 'Período temporal para agrupamento de transações',
});

@ObjectType()
export class TransactionGroupModel {
  @Field(() => TransactionPeriod)
  period: TransactionPeriod;

  @Field()
  label: string;

  @Field(() => [TransactionModel])
  transactions: TransactionModel[];

  @Field(() => Int)
  count: number;

  @Field()
  hasMore: boolean;
}
