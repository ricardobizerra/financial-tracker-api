import {
  ArgsType,
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum InvestmentEvolutionPeriod {
  MONTH = 'MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  YEAR = 'YEAR',
  ALL = 'ALL',
}

registerEnumType(InvestmentEvolutionPeriod, {
  name: 'InvestmentEvolutionPeriod',
});

@ObjectType()
export class InvestmentEvolutionPointModel {
  @Field()
  date!: Date;

  @Field(() => Float)
  invested!: number;

  @Field(() => Float)
  currentAmount!: number;

  @Field(() => Float)
  taxedAmount!: number;

  @Field(() => Float)
  profit!: number;
}

@ObjectType()
export class InvestmentEvolutionModel {
  @Field(() => [InvestmentEvolutionPointModel])
  dataPoints!: InvestmentEvolutionPointModel[];

  @Field(() => Float)
  totalInvested!: number;

  @Field(() => Float)
  totalCurrentAmount!: number;

  @Field(() => Float)
  totalTaxedAmount!: number;

  @Field()
  totalProfit!: string;

  @Field()
  totalProfitPercentage!: string;
}

@ArgsType()
export class InvestmentEvolutionArgs {
  @Field(() => InvestmentEvolutionPeriod, {
    defaultValue: InvestmentEvolutionPeriod.YEAR,
  })
  period?: InvestmentEvolutionPeriod;

  @Field(() => String, { nullable: true })
  accountId?: string;
}
