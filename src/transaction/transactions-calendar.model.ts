import { ObjectType, Field, Float, ArgsType, Int } from '@nestjs/graphql';

@ObjectType()
export class CalendarDayTransactionModel {
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
}

@ObjectType()
export class CalendarDayModel {
  @Field()
  date: Date;

  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpense: number;

  @Field(() => Int)
  transactionCount: number;

  @Field(() => [CalendarDayTransactionModel])
  transactions: CalendarDayTransactionModel[];
}

@ObjectType()
export class TransactionsCalendarModel {
  @Field(() => [CalendarDayModel])
  days: CalendarDayModel[];

  @Field(() => Float)
  monthTotalIncome: number;

  @Field(() => Float)
  monthTotalExpense: number;

  @Field(() => Float)
  monthBalance: number;
}

@ArgsType()
export class TransactionsCalendarArgs {
  @Field({ nullable: true })
  accountId?: string;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  month: number;
}
