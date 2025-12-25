import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  GraphQLDecimal,
  transformToDecimal,
} from 'prisma-graphql-type-decimal';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

@ObjectType()
export class TransactionsSummaryModel {
  // Legacy fields (para compatibilidade)
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

  // Saldo Realizado (apenas COMPLETED)
  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  realizedIncome: Decimal;

  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  realizedExpense: Decimal;

  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  realizedBalance: Decimal;

  // Saldo Previsto (COMPLETED + PLANNED + OVERDUE, exclui CANCELED)
  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  forecastIncome: Decimal;

  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  forecastExpense: Decimal;

  @Field(() => GraphQLDecimal)
  @Type(() => Object)
  @Transform(transformToDecimal)
  forecastBalance: Decimal;
}
