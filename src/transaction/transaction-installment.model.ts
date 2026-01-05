import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Prisma } from '@prisma/client';

@ObjectType()
export class TransactionInstallmentModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  installmentNumber: number;

  @Field(() => GraphQLDecimal)
  amount: Prisma.Decimal;

  @Field(() => ID)
  transactionId: string;

  @Field(() => ID, { nullable: true })
  cardBillingId?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
