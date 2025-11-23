import { AccountCard, CardBilling } from '@/lib/graphql/prisma-client';
import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@ObjectType()
export class CardBillingModel extends OmitType(CardBilling, [
  '_count',
] as const) {
  @Field(() => GraphQLDecimal)
  totalAmount: Decimal;
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
