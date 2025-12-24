import { PaymentMethod } from '@/lib/graphql/prisma-client';
import { InputType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';

export enum UpdateRecurringScope {
  THIS_ONLY = 'THIS_ONLY',
  THIS_AND_FUTURE = 'THIS_AND_FUTURE',
  ALL_PLANNED = 'ALL_PLANNED',
}

registerEnumType(UpdateRecurringScope, {
  name: 'UpdateRecurringScope',
  description: 'Scope for updating recurring transactions',
});

@InputType()
export class UpdateRecurringTransactionsInput {
  @Field(() => ID)
  transactionId: string;

  @Field(() => UpdateRecurringScope)
  scope: UpdateRecurringScope;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod;
}
