import { CardType } from '@/lib/graphql/prisma-client';
import { Field, InputType, ID } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@InputType()
class CreateAccountCardInfos {
  @Field(() => CardType)
  type: CardType;

  // Campos opcionais - apenas para cartões de crédito
  @Field(() => Number, { nullable: true })
  billingCycleDay?: number;

  @Field(() => Number, { nullable: true })
  billingPaymentDay?: number;

  @Field(() => GraphQLDecimal, { nullable: true })
  defaultLimit?: Decimal;
}

@InputType()
export class CreateAccountInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ID)
  institutionConnectionId: string;

  @Field(() => GraphQLDecimal)
  initialBalance: Decimal;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => CreateAccountCardInfos, { nullable: true })
  cardInfos?: CreateAccountCardInfos;
}
