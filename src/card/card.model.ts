import { AccountCard, CardBilling } from '@/lib/graphql/prisma-client';
import { Field, ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class CardBillingModel extends OmitType(CardBilling, [
  '_count',
] as const) {
  @Field(() => AccountCard, { nullable: true })
  accountCard?: AccountCard;
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
