import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class BulkCancelTransactionsInput {
  @Field(() => [ID])
  ids!: string[];
}
