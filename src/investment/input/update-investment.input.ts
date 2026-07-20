import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateInvestmentInput } from './create-investment.input';

@InputType()
export class UpdateInvestmentInput extends PartialType(CreateInvestmentInput) {
  @Field(() => ID, { nullable: false })
  id!: string;
}
