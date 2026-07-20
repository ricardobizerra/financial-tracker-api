import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class BulkDeleteTransactionsInput {
  @Field(() => [ID])
  ids!: string[];
}
