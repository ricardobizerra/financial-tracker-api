import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class ConfirmTransactionInput {
  @Field(() => ID)
  id: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => Date, { nullable: true })
  date?: Date;
}
