import { Field, ID, InputType } from '@nestjs/graphql';
import { TransactionCategory } from '@/lib/graphql/prisma-client';

@InputType()
export class BulkUpdateTransactionsInput {
  @Field(() => [ID])
  ids!: string[];

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}
