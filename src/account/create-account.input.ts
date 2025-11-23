import { AccountType, CardType } from '@/lib/graphql/prisma-client';
import { Field, InputType, ID } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@InputType()
class CreateAccountCardInfos {
  @Field(() => CardType)
  type: CardType;

  @Field(() => Number)
  billingCycleDay: number;

  @Field(() => Number)
  billingPaymentDay: number;

  @Field(() => GraphQLDecimal)
  defaultLimit: Decimal;
}

@InputType()
export class CreateAccountInput {
  @Field(() => String)
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ID)
  institutionId: string;

  @Field(() => GraphQLDecimal)
  initialBalance: Decimal;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => CreateAccountCardInfos, { nullable: true })
  cardInfos?: CreateAccountCardInfos;
}
