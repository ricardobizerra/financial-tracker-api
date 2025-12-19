import {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionType,
} from '@/lib/graphql/prisma-client';
import { Field, ID, InputType, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateRecurringTransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Float)
  estimatedAmount!: number;

  @Field(() => TransactionType)
  type!: keyof typeof TransactionType;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;

  @Field(() => RecurrenceFrequency)
  frequency!: keyof typeof RecurrenceFrequency;

  @Field(() => Int)
  dayOfMonth!: number;

  @Field(() => Int, { nullable: true })
  monthOfYear?: number;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => ID, { nullable: true })
  sourceAccountId?: string;

  @Field(() => ID, { nullable: true })
  destinyAccountId?: string;
}
