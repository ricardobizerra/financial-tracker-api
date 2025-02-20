import { Regime } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import { ArgsType, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvestmentModel {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  initialAmount!: string;

  @Field(() => String, { nullable: false })
  currentAmount!: string;

  @Field(() => String, { nullable: false })
  currentVariation!: string;

  @Field(() => String, { nullable: false })
  taxPercentage!: string;

  @Field(() => String, { nullable: false })
  taxedAmount!: string;

  @Field(() => String, { nullable: false })
  taxedVariation!: string;

  @Field(() => String, { nullable: false })
  period!: string;

  @Field(() => Int, { nullable: false })
  duration!: number;

  @Field(() => Regime, { nullable: false })
  regimeName!: Regime;

  @Field(() => Float, { nullable: false, defaultValue: 100 })
  regimePercentage!: number;
}

@ObjectType()
export class InvestmentConnection extends Connection(InvestmentModel) {}

enum OrderBy {
  id = 'id',
  initialAmount = 'amount',
  period = 'startDate',
  duration = 'duration',
  regimeName = 'regimeName',
  regimePercentage = 'regimePercentage',
}

@ArgsType()
export class OrdenationInvestmentArgs extends Ordenation(
  InvestmentModel,
  OrderBy,
) {}
