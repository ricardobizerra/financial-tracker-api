import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  GraphQLDecimal,
  transformToDecimal,
} from 'prisma-graphql-type-decimal';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

@ObjectType()
export class TransactionsSummaryModel {
  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalIncome: Decimal;

  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalExpense: Decimal;

  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  balance: Decimal;

  @Field(() => Int)
  transactionCount: number;
}
