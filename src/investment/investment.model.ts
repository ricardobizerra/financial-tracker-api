import { Investment } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import {
  ArgsType,
  Field,
  Float,
  Int,
  ObjectType,
  OmitType,
} from '@nestjs/graphql';

@ObjectType()
export class InvestmentModel extends OmitType(Investment, [
  'user',
  'userId',
] as const) {
  @Field(() => String, { nullable: false })
  currentVariation!: string;

  @Field(() => String, { nullable: false })
  taxPercentage!: string;

  @Field(() => String, { nullable: false })
  taxedVariation!: string;
}

@ObjectType()
export class InvestmentConnection extends Connection(InvestmentModel) {}

@ArgsType()
export class OrdenationInvestmentArgs extends Ordenation(InvestmentModel, [
  'currentVariation',
  'taxedVariation',
  'taxPercentage',
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

@ObjectType()
export class InvestmentRegimeSummary {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => Int, { nullable: false })
  quantity!: number;

  @Field(() => Float, { nullable: false })
  totalInvested!: number;

  @Field(() => Float, { nullable: false })
  currentInvested!: number;

  @Field(() => String, { nullable: false })
  currentInvestedPercentage!: string;

  @Field(() => Float, { nullable: false })
  taxedInvested!: number;

  @Field(() => String, { nullable: false })
  taxedInvestedPercentage!: string;
}

@ObjectType()
export class InvestmentRegimeSummaryConnection extends Connection(
  InvestmentRegimeSummary,
) {}
