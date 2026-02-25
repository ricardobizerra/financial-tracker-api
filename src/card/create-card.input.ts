import { CardType } from '@/lib/graphql/prisma-client';
import { Field, InputType, ID } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@InputType()
export class CreateCardInput {
  @Field(() => String)
  name: string;

  @Field(() => CardType)
  type: CardType;

  @Field(() => ID)
  institutionLinkId: string;

  @Field(() => Number, { nullable: true })
  billingCycleDay?: number;

  @Field(() => Number, { nullable: true })
  billingPaymentDay?: number;

  @Field(() => GraphQLDecimal, { nullable: true })
  defaultLimit?: Decimal;
}
