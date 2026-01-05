import {
  PaymentMethod,
  RecurrenceFrequency,
} from '@/lib/graphql/prisma-client';
import { Field, ID, InputType, Float, Int } from '@nestjs/graphql';

@InputType()
export class UpdateRecurringTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  estimatedAmount?: number;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;

  @Field(() => Int, { nullable: true })
  dayOfMonth?: number;

  @Field(() => Int, { nullable: true })
  monthOfYear?: number;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => ID, { nullable: true })
  sourceAccountId?: string;

  @Field(() => ID, { nullable: true })
  destinyAccountId?: string;
}
