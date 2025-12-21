import { ObjectType, Field, Float, ArgsType, Int } from '@nestjs/graphql';

@ObjectType()
export class AgendaTransactionModel {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field(() => Float)
  amount: number;

  @Field()
  type: string;

  @Field()
  status: string;

  @Field()
  date: Date;

  @Field(() => Int)
  daysUntilDue: number;

  @Field()
  isOverdue: boolean;
}

@ObjectType()
export class AgendaGroupModel {
  @Field()
  label: string;

  @Field(() => [AgendaTransactionModel])
  transactions: AgendaTransactionModel[];
}

@ObjectType()
export class FinancialAgendaModel {
  @Field(() => [AgendaGroupModel])
  groups: AgendaGroupModel[];

  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpense: number;

  @Field(() => Float)
  balance: number;

  @Field(() => Int)
  pendingCount: number;
}

@ArgsType()
export class FinancialAgendaArgs {
  @Field({ nullable: true })
  accountId?: string;

  @Field(() => Int, { defaultValue: 60 })
  daysAhead: number;
}
