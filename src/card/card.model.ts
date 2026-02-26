import { Card, CardBilling, CardType } from '@/lib/graphql/prisma-client';
import { Field, ObjectType, OmitType, ArgsType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';

@ObjectType()
export class CardBillingModel extends OmitType(CardBilling, [
  '_count',
] as const) {
  @Field(() => GraphQLDecimal)
  totalAmount: Decimal;

  @Field(() => Number)
  usagePercentage: number;

  @Field(() => Number)
  transactionsCount: number;
}

@ObjectType()
export class CardBillingOnDate {
  @Field(() => CardBillingModel, { nullable: true })
  billing?: CardBillingModel;

  @Field(() => String, { nullable: true })
  nextBillingId?: string;

  @Field(() => String, { nullable: true })
  previousBillingId?: string;
}

@ObjectType()
export class CardConnection extends Connection(Card) {}

@ArgsType()
export class OrdenationCardArgs extends Ordenation(Card, [
  'updatedAt',
  'institutionLink',
  'billings',
  'sourceTransactions',
  'sourceRecurringTransactions',
  '_count',
]) {}

@ArgsType()
export class CardFilterArgs {
  @Field(() => String, { nullable: true })
  institutionLinkId?: string;

  @Field(() => [CardType], { nullable: true })
  types?: CardType[];
}
