import { Regime } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import { ArgsType, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvestmentModel {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => Float, { nullable: false })
  initialAmount!: number;

  @Field(() => Float, { nullable: false })
  currentAmount!: number;

  @Field(() => String, { nullable: false })
  currentVariation!: string;

  @Field(() => String, { nullable: false })
  taxPercentage!: string;

  @Field(() => Float, { nullable: false })
  taxedAmount!: number;

  @Field(() => String, { nullable: false })
  taxedVariation!: string;

  @Field(() => String, { nullable: false })
  period!: string;

  @Field(() => String, { nullable: false })
  finishedAt!: Date;

  @Field(() => Int, { nullable: false })
  duration!: number;

  @Field(() => Regime, { nullable: false })
  regimeName!: Regime;

  @Field(() => Float, { nullable: false, defaultValue: 100 })
  regimePercentage!: number;
}

@ObjectType()
export class InvestmentConnection extends Connection(InvestmentModel) {}

@ArgsType()
export class OrdenationInvestmentArgs extends Ordenation(InvestmentModel, [
  'currentAmount',
  'taxedAmount',
  'currentVariation',
  'taxedVariation',
  'taxPercentage',
  'finishedAt',
]) {}

@ObjectType()
export class TotalInvestmentsModel {
  @Field(() => Float, { nullable: false })
  initialAmount!: number;

  @Field(() => Float, { nullable: false })
  currentAmount!: number;

  @Field(() => String, { nullable: false })
  currentVariation!: string;

  @Field(() => Float, { nullable: false })
  taxedAmount!: number;

  @Field(() => String, { nullable: false })
  taxedVariation!: string;
}
