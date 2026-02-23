import {
  ObjectType,
  Field,
  Float,
  ArgsType,
  registerEnumType,
} from '@nestjs/graphql';

export enum BalanceForecastPeriod {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM',
}

registerEnumType(BalanceForecastPeriod, {
  name: 'BalanceForecastPeriod',
  description: 'Period presets for balance forecast',
});

@ObjectType()
export class BalanceForecastTransactionModel {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field(() => Float)
  amount: number;

  @Field()
  type: string;

  @Field()
  isIncome: boolean;
}

@ObjectType()
export class BalanceForecastPointModel {
  @Field()
  date: Date;

  @Field(() => Float)
  balance: number;

  @Field()
  isProjected: boolean;

  @Field(() => Float)
  incomeAmount: number;

  @Field(() => Float)
  expenseAmount: number;

  @Field()
  transactionCount: number;

  @Field(() => [BalanceForecastTransactionModel])
  transactions: BalanceForecastTransactionModel[];
}

@ObjectType()
export class BalanceForecastModel {
  @Field(() => [BalanceForecastPointModel])
  dataPoints: BalanceForecastPointModel[];

  @Field(() => Float)
  currentBalance: number;

  @Field(() => Float)
  projectedBalance: number;

  @Field(() => Float)
  balanceTrend: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

@ArgsType()
export class BalanceForecastArgs {
  @Field({ nullable: true })
  accountId?: string;

  @Field(() => BalanceForecastPeriod, {
    defaultValue: BalanceForecastPeriod.THREE_MONTHS,
  })
  period: BalanceForecastPeriod;

  @Field({
    nullable: true,
    description: 'Custom start date (only used when period is CUSTOM)',
  })
  startDate?: Date;

  @Field({
    nullable: true,
    description: 'Custom end date (only used when period is CUSTOM)',
  })
  endDate?: Date;
}
