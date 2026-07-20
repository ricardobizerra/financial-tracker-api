import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaxHistoryPointModel {
  @Field()
  date!: string;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field(() => Float, { nullable: true })
  component1?: number;

  @Field(() => Float, { nullable: true })
  component2?: number;

  @Field(() => Float, { nullable: true })
  total?: number;
}

@ObjectType()
export class RegimeTaxesHistoryModel {
  @Field(() => [TaxHistoryPointModel])
  dataPoints!: TaxHistoryPointModel[];
}

@ObjectType()
export class InvestmentTaxesHistoryModel {
  @Field(() => [TaxHistoryPointModel])
  dataPoints!: TaxHistoryPointModel[];
}
