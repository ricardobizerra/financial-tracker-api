import { InvestmentStatus, Regime, InvestmentType } from '@/lib/graphql/prisma-client';
import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';

@InputType()
export class CreateInvestmentInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Float, { nullable: false })
  amount!: number;

  @Field(() => Float, { nullable: true })
  correctedAmount?: number;

  @Field(() => Float, { nullable: true })
  taxedAmount?: number;

  @Field(() => Date, { nullable: false })
  startDate!: Date | string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;

  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;

  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;

  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;

  @Field(() => Float, { nullable: true })
  regimePercentage?: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;

  @Field(() => ID, { nullable: false })
  institutionLinkId!: string;

  @Field(() => InvestmentType, { nullable: true })
  type?: keyof typeof InvestmentType;

  @Field(() => Float, { nullable: true })
  fixedRate?: number;

  @Field(() => Float, { nullable: true })
  brokerageFee?: number;

  @Field(() => Date, { nullable: true })
  maturityDate?: Date | string;
}
