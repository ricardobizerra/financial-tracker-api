import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class RescheduleTransactionInput {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  newDate: Date;
}
