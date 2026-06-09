import {
  TransactionType,
  RecurrenceFrequency,
  Regime,
} from '@/lib/graphql/prisma-client';
import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SimulatedTransactionInput {
  @Field()
  description: string;

  @Field(() => Float)
  amount: number;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field()
  date: Date;

  @Field()
  isRecurring: boolean;

  @Field(() => RecurrenceFrequency, { nullable: true })
  recurrenceFrequency?: RecurrenceFrequency;

  @Field({ nullable: true })
  recurrenceEndDate?: Date;

  @Field(() => ID)
  accountId: string;

  @Field(() => ID, { nullable: true })
  destinyAccountId?: string;
}

@InputType()
export class SimulatedInvestmentInput {
  @Field()
  description: string;

  @Field(() => Float)
  initialAmount: number;

  @Field(() => Float)
  annualRate: number;

  @Field(() => Regime)
  regime: Regime;

  @Field()
  startDate: Date;

  @Field(() => ID)
  accountId: string;
}

@InputType()
export class SimulateBalanceForecastInput {
  @Field(() => ID, { nullable: true })
  accountId?: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => [SimulatedTransactionInput])
  simulatedTransactions: SimulatedTransactionInput[];

  @Field(() => [SimulatedInvestmentInput])
  simulatedInvestments: SimulatedInvestmentInput[];
}
