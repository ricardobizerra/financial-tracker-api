import {
  PaymentMethod,
  TransactionCreateWithoutUserInput,
} from '@/lib/graphql/prisma-client';
import { Field, ID, InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput extends OmitType(
  TransactionCreateWithoutUserInput,
  [
    'id',
    'createdAt',
    'updatedAt',
    'destinyAccount',
    'sourceAccount',
    'cardBilling',
  ] as const,
) {
  @Field(() => PaymentMethod)
  paymentMethod!: keyof typeof PaymentMethod;

  @Field(() => ID, {
    nullable: true,
  })
  sourceAccountId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  destinyAccountId?: string;
}
