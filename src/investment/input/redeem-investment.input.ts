import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class RedeemInvestmentInput {
  @Field(() => ID, { nullable: false })
  investmentId!: string;

  @Field(() => Date, { nullable: true })
  finishedAt?: Date;
}
