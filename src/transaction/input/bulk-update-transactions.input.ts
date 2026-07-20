import { Field, ID, InputType } from '@nestjs/graphql';
import { TransactionCategory, TransactionStatus, PaymentMethod } from '@/lib/graphql/prisma-client';

@InputType()
export class BulkUpdateTransactionsInput {
  @Field(() => [ID])
  ids!: string[];

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @Field(() => TransactionStatus, { nullable: true })
  status?: keyof typeof TransactionStatus;

  @Field(() => ID, { nullable: true })
  sourceAccountId?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;
}
