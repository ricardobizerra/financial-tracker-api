import {
  DayMode,
  PaymentMethod,
  RecurrenceFrequency,
  RecurrenceType,
  TransactionCategory,
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

  @Field(() => DayMode, { nullable: true, defaultValue: 'SPECIFIC_DAY' })
  dayMode?: keyof typeof DayMode;

  @Field(() => Int, { nullable: true })
  dayOfMonth?: number; // 1-31 for SPECIFIC_DAY mode (monthly, clamped to last day of month)

  @Field(() => Int, { nullable: true })
  dayOfWeek?: number; // 0-6 (Sun-Sat) for WEEKLY/BI_WEEKLY

  @Field(() => Int, { nullable: true })
  weekOfMonth?: number; // 1-5 for NTH_WEEKDAY mode (e.g., 2nd Tuesday)

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

  @Field(() => ID, { nullable: true })
  sourceCardId?: string;

  // Campos de parcelamento
  @Field(() => RecurrenceType, { nullable: true, defaultValue: 'PERIODIC' })
  recurrenceType?: keyof typeof RecurrenceType;

  @Field(() => Int, { nullable: true })
  totalInstallments?: number;

  @Field(() => Int, { nullable: true })
  repeatCount?: number;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}
