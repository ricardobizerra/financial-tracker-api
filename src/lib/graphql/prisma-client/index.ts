import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { Int } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { transformToDecimal } from 'prisma-graphql-type-decimal';
import { Transform } from 'class-transformer';
import { registerEnumType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
  id = 'id',
  email = 'email',
  password = 'password',
  name = 'name',
  role = 'role',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum TransactionScalarFieldEnum {
  id = 'id',
  description = 'description',
  amount = 'amount',
  date = 'date',
  status = 'status',
  type = 'type',
  paymentMethod = 'paymentMethod',
  sourceAccountId = 'sourceAccountId',
  destinyAccountId = 'destinyAccountId',
  cardBillingId = 'cardBillingId',
  userId = 'userId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  BETWEEN_ACCOUNTS = 'BETWEEN_ACCOUNTS',
}

export enum TransactionStatus {
  PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum TransactionIsolationLevel {
  ReadUncommitted = 'ReadUncommitted',
  ReadCommitted = 'ReadCommitted',
  RepeatableRead = 'RepeatableRead',
  Serializable = 'Serializable',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum RelationLoadStrategy {
  query = 'query',
  join = 'join',
}

export enum Regime {
  CDI = 'CDI',
  POUPANCA = 'POUPANCA',
}

export enum QueryMode {
  'default' = 'default',
  insensitive = 'insensitive',
}

export enum PaymentMethod {
  CASH = 'CASH',
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BOLETO = 'BOLETO',
}

export enum NullsOrder {
  first = 'first',
  last = 'last',
}

export enum InvestmentTransactionRole {
  FUNDING = 'FUNDING',
  REDEMPTION = 'REDEMPTION',
  INCOME = 'INCOME',
  FEE = 'FEE',
}

export enum InvestmentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum CardType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum CardBillingStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED',
}

export enum AccountType {
  WALLET = 'WALLET',
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  CREDIT_CARD = 'CREDIT_CARD',
  OTHER = 'OTHER',
}

export enum InvestmentTransactionScalarFieldEnum {
  id = 'id',
  role = 'role',
  amount = 'amount',
  investmentId = 'investmentId',
  accountId = 'accountId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum InvestmentScalarFieldEnum {
  id = 'id',
  amount = 'amount',
  correctedAmount = 'correctedAmount',
  taxedAmount = 'taxedAmount',
  startDate = 'startDate',
  duration = 'duration',
  finishedAt = 'finishedAt',
  lastCorrectedAt = 'lastCorrectedAt',
  status = 'status',
  regimeName = 'regimeName',
  regimePercentage = 'regimePercentage',
  userId = 'userId',
  accountId = 'accountId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum InstitutionScalarFieldEnum {
  id = 'id',
  code = 'code',
  name = 'name',
  logoUrl = 'logoUrl',
  color = 'color',
  types = 'types',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum CardBillingScalarFieldEnum {
  id = 'id',
  periodStart = 'periodStart',
  periodEnd = 'periodEnd',
  dueDate = 'dueDate',
  closingDate = 'closingDate',
  totalAmount = 'totalAmount',
  paidAmount = 'paidAmount',
  minimumPayment = 'minimumPayment',
  status = 'status',
  accountCardId = 'accountCardId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum AccountCardScalarFieldEnum {
  id = 'id',
  lastFourDigits = 'lastFourDigits',
  billingCycleDay = 'billingCycleDay',
  type = 'type',
  accountId = 'accountId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum AccountScalarFieldEnum {
  id = 'id',
  name = 'name',
  type = 'type',
  initialBalance = 'initialBalance',
  description = 'description',
  isActive = 'isActive',
  userId = 'userId',
  institutionId = 'institutionId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

registerEnumType(AccountScalarFieldEnum, {
  name: 'AccountScalarFieldEnum',
  description: undefined,
});
registerEnumType(AccountCardScalarFieldEnum, {
  name: 'AccountCardScalarFieldEnum',
  description: undefined,
});
registerEnumType(CardBillingScalarFieldEnum, {
  name: 'CardBillingScalarFieldEnum',
  description: undefined,
});
registerEnumType(InstitutionScalarFieldEnum, {
  name: 'InstitutionScalarFieldEnum',
  description: undefined,
});
registerEnumType(InvestmentScalarFieldEnum, {
  name: 'InvestmentScalarFieldEnum',
  description: undefined,
});
registerEnumType(InvestmentTransactionScalarFieldEnum, {
  name: 'InvestmentTransactionScalarFieldEnum',
  description: undefined,
});
registerEnumType(AccountType, { name: 'AccountType', description: undefined });
registerEnumType(CardBillingStatus, {
  name: 'CardBillingStatus',
  description: undefined,
});
registerEnumType(CardType, { name: 'CardType', description: undefined });
registerEnumType(InvestmentStatus, {
  name: 'InvestmentStatus',
  description: undefined,
});
registerEnumType(InvestmentTransactionRole, {
  name: 'InvestmentTransactionRole',
  description: undefined,
});
registerEnumType(NullsOrder, { name: 'NullsOrder', description: undefined });
registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: undefined,
});
registerEnumType(QueryMode, { name: 'QueryMode', description: undefined });
registerEnumType(Regime, { name: 'Regime', description: undefined });
registerEnumType(RelationLoadStrategy, {
  name: 'RelationLoadStrategy',
  description: undefined,
});
registerEnumType(Role, { name: 'Role', description: undefined });
registerEnumType(SortOrder, { name: 'SortOrder', description: undefined });
registerEnumType(TransactionIsolationLevel, {
  name: 'TransactionIsolationLevel',
  description: undefined,
});
registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
  description: undefined,
});
registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: undefined,
});
registerEnumType(TransactionScalarFieldEnum, {
  name: 'TransactionScalarFieldEnum',
  description: undefined,
});
registerEnumType(UserScalarFieldEnum, {
  name: 'UserScalarFieldEnum',
  description: undefined,
});

@ArgsType()
export class AccountAggregateArgs {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => [AccountOrderByWithRelationInput], { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  orderBy?: Array<AccountOrderByWithRelationInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  cursor?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => AccountCountAggregateInput, { nullable: true })
  @Type(() => AccountCountAggregateInput)
  _count?: InstanceType<typeof AccountCountAggregateInput>;
  @Field(() => AccountAvgAggregateInput, { nullable: true })
  @Type(() => AccountAvgAggregateInput)
  _avg?: InstanceType<typeof AccountAvgAggregateInput>;
  @Field(() => AccountSumAggregateInput, { nullable: true })
  @Type(() => AccountSumAggregateInput)
  _sum?: InstanceType<typeof AccountSumAggregateInput>;
  @Field(() => AccountMinAggregateInput, { nullable: true })
  @Type(() => AccountMinAggregateInput)
  _min?: InstanceType<typeof AccountMinAggregateInput>;
  @Field(() => AccountMaxAggregateInput, { nullable: true })
  @Type(() => AccountMaxAggregateInput)
  _max?: InstanceType<typeof AccountMaxAggregateInput>;
}

@InputType()
export class AccountAvgAggregateInput {
  @Field(() => Boolean, { nullable: true })
  initialBalance?: true;
}

@ObjectType()
export class AccountAvgAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  initialBalance?: Decimal;
}

@InputType()
export class AccountAvgOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
}

@InputType()
export class AccountCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  initialBalance?: true;
  @Field(() => Boolean, { nullable: true })
  description?: true;
  @Field(() => Boolean, { nullable: true })
  isActive?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  institutionId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class AccountCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  name!: number;
  @Field(() => Int, { nullable: false })
  type!: number;
  @Field(() => Int, { nullable: false })
  initialBalance!: number;
  @Field(() => Int, { nullable: false })
  description!: number;
  @Field(() => Int, { nullable: false })
  isActive!: number;
  @Field(() => Int, { nullable: false })
  userId!: number;
  @Field(() => Int, { nullable: false })
  institutionId!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class AccountCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  isActive?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  institutionId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@ObjectType()
export class AccountCount {
  @Field(() => Int, { nullable: false })
  sourceTransactions?: number;
  @Field(() => Int, { nullable: false })
  destinyTransactions?: number;
  @Field(() => Int, { nullable: false })
  investments?: number;
  @Field(() => Int, { nullable: false })
  investmentTransactions?: number;
}

@InputType()
export class AccountCreateManyInstitutionInputEnvelope {
  @Field(() => [AccountCreateManyInstitutionInput], { nullable: false })
  @Type(() => AccountCreateManyInstitutionInput)
  data!: Array<AccountCreateManyInstitutionInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class AccountCreateManyInstitutionInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCreateManyUserInputEnvelope {
  @Field(() => [AccountCreateManyUserInput], { nullable: false })
  @Type(() => AccountCreateManyUserInput)
  data!: Array<AccountCreateManyUserInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class AccountCreateManyUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCreateNestedManyWithoutInstitutionInput {
  @Field(() => [AccountCreateWithoutInstitutionInput], { nullable: true })
  @Type(() => AccountCreateWithoutInstitutionInput)
  create?: Array<AccountCreateWithoutInstitutionInput>;
  @Field(() => [AccountCreateOrConnectWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInstitutionInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutInstitutionInput>;
  @Field(() => AccountCreateManyInstitutionInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyInstitutionInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyInstitutionInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
}

@InputType()
export class AccountCreateNestedManyWithoutUserInput {
  @Field(() => [AccountCreateWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateWithoutUserInput)
  create?: Array<AccountCreateWithoutUserInput>;
  @Field(() => [AccountCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutUserInput>;
  @Field(() => AccountCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyUserInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
}

@InputType()
export class AccountCreateNestedOneWithoutAccountCardInput {
  @Field(() => AccountCreateWithoutAccountCardInput, { nullable: true })
  @Type(() => AccountCreateWithoutAccountCardInput)
  create?: InstanceType<typeof AccountCreateWithoutAccountCardInput>;
  @Field(() => AccountCreateOrConnectWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutAccountCardInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutAccountCardInput
  >;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
}

@InputType()
export class AccountCreateNestedOneWithoutDestinyTransactionsInput {
  @Field(() => AccountCreateWithoutDestinyTransactionsInput, { nullable: true })
  @Type(() => AccountCreateWithoutDestinyTransactionsInput)
  create?: InstanceType<typeof AccountCreateWithoutDestinyTransactionsInput>;
  @Field(() => AccountCreateOrConnectWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutDestinyTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutDestinyTransactionsInput
  >;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
}

@InputType()
export class AccountCreateNestedOneWithoutInvestmentTransactionsInput {
  @Field(() => AccountCreateWithoutInvestmentTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateWithoutInvestmentTransactionsInput)
  create?: InstanceType<typeof AccountCreateWithoutInvestmentTransactionsInput>;
  @Field(() => AccountCreateOrConnectWithoutInvestmentTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInvestmentTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutInvestmentTransactionsInput
  >;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
}

@InputType()
export class AccountCreateNestedOneWithoutInvestmentsInput {
  @Field(() => AccountCreateWithoutInvestmentsInput, { nullable: true })
  @Type(() => AccountCreateWithoutInvestmentsInput)
  create?: InstanceType<typeof AccountCreateWithoutInvestmentsInput>;
  @Field(() => AccountCreateOrConnectWithoutInvestmentsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInvestmentsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutInvestmentsInput
  >;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
}

@InputType()
export class AccountCreateNestedOneWithoutSourceTransactionsInput {
  @Field(() => AccountCreateWithoutSourceTransactionsInput, { nullable: true })
  @Type(() => AccountCreateWithoutSourceTransactionsInput)
  create?: InstanceType<typeof AccountCreateWithoutSourceTransactionsInput>;
  @Field(() => AccountCreateOrConnectWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutSourceTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutSourceTransactionsInput
  >;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
}

@InputType()
export class AccountCreateOrConnectWithoutAccountCardInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutAccountCardInput, { nullable: false })
  @Type(() => AccountCreateWithoutAccountCardInput)
  create!: InstanceType<typeof AccountCreateWithoutAccountCardInput>;
}

@InputType()
export class AccountCreateOrConnectWithoutDestinyTransactionsInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutDestinyTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateWithoutDestinyTransactionsInput)
  create!: InstanceType<typeof AccountCreateWithoutDestinyTransactionsInput>;
}

@InputType()
export class AccountCreateOrConnectWithoutInstitutionInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutInstitutionInput, { nullable: false })
  @Type(() => AccountCreateWithoutInstitutionInput)
  create!: InstanceType<typeof AccountCreateWithoutInstitutionInput>;
}

@InputType()
export class AccountCreateOrConnectWithoutInvestmentTransactionsInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutInvestmentTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateWithoutInvestmentTransactionsInput)
  create!: InstanceType<typeof AccountCreateWithoutInvestmentTransactionsInput>;
}

@InputType()
export class AccountCreateOrConnectWithoutInvestmentsInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutInvestmentsInput, { nullable: false })
  @Type(() => AccountCreateWithoutInvestmentsInput)
  create!: InstanceType<typeof AccountCreateWithoutInvestmentsInput>;
}

@InputType()
export class AccountCreateOrConnectWithoutSourceTransactionsInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutSourceTransactionsInput, { nullable: false })
  @Type(() => AccountCreateWithoutSourceTransactionsInput)
  create!: InstanceType<typeof AccountCreateWithoutSourceTransactionsInput>;
}

@InputType()
export class AccountCreateOrConnectWithoutUserInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateWithoutUserInput, { nullable: false })
  @Type(() => AccountCreateWithoutUserInput)
  create!: InstanceType<typeof AccountCreateWithoutUserInput>;
}

@InputType()
export class AccountCreateWithoutAccountCardInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateWithoutDestinyTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateWithoutInstitutionInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateWithoutInvestmentTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateWithoutInvestmentsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateWithoutSourceTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutAccountsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutAccountsInput>;
  @Field(() => InstitutionCreateNestedOneWithoutAccountsInput, {
    nullable: false,
  })
  @Type(() => InstitutionCreateNestedOneWithoutAccountsInput)
  institution!: InstanceType<
    typeof InstitutionCreateNestedOneWithoutAccountsInput
  >;
  @Field(() => AccountCardCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentCreateNestedManyWithoutAccountInput
  >;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutAccountInput
  >;
}

@ArgsType()
export class AccountGroupByArgs {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => [AccountOrderByWithAggregationInput], { nullable: true })
  @Type(() => AccountOrderByWithAggregationInput)
  orderBy?: Array<AccountOrderByWithAggregationInput>;
  @Field(() => [AccountScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof AccountScalarFieldEnum>;
  @Field(() => AccountScalarWhereWithAggregatesInput, { nullable: true })
  @Type(() => AccountScalarWhereWithAggregatesInput)
  having?: InstanceType<typeof AccountScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => AccountCountAggregateInput, { nullable: true })
  @Type(() => AccountCountAggregateInput)
  _count?: InstanceType<typeof AccountCountAggregateInput>;
  @Field(() => AccountAvgAggregateInput, { nullable: true })
  @Type(() => AccountAvgAggregateInput)
  _avg?: InstanceType<typeof AccountAvgAggregateInput>;
  @Field(() => AccountSumAggregateInput, { nullable: true })
  @Type(() => AccountSumAggregateInput)
  _sum?: InstanceType<typeof AccountSumAggregateInput>;
  @Field(() => AccountMinAggregateInput, { nullable: true })
  @Type(() => AccountMinAggregateInput)
  _min?: InstanceType<typeof AccountMinAggregateInput>;
  @Field(() => AccountMaxAggregateInput, { nullable: true })
  @Type(() => AccountMaxAggregateInput)
  _max?: InstanceType<typeof AccountMaxAggregateInput>;
}

@ObjectType()
export class AccountGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: false })
  initialBalance!: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: false })
  isActive!: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => AccountCountAggregate, { nullable: true })
  _count?: InstanceType<typeof AccountCountAggregate>;
  @Field(() => AccountAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof AccountAvgAggregate>;
  @Field(() => AccountSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof AccountSumAggregate>;
  @Field(() => AccountMinAggregate, { nullable: true })
  _min?: InstanceType<typeof AccountMinAggregate>;
  @Field(() => AccountMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof AccountMaxAggregate>;
}

@InputType()
export class AccountListRelationFilter {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  every?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  some?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  none?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  initialBalance?: true;
  @Field(() => Boolean, { nullable: true })
  description?: true;
  @Field(() => Boolean, { nullable: true })
  isActive?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  institutionId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class AccountMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => AccountType, { nullable: true })
  type?: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: true })
  userId?: string;
  @Field(() => String, { nullable: true })
  institutionId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  isActive?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  institutionId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class AccountMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  initialBalance?: true;
  @Field(() => Boolean, { nullable: true })
  description?: true;
  @Field(() => Boolean, { nullable: true })
  isActive?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  institutionId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class AccountMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => AccountType, { nullable: true })
  type?: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: true })
  userId?: string;
  @Field(() => String, { nullable: true })
  institutionId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  isActive?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  institutionId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class AccountNullableRelationFilter {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  is?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  isNot?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountOrderByRelationAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  _count?: keyof typeof SortOrder;
}

@InputType()
export class AccountOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  description?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  isActive?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  institutionId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountCountOrderByAggregateInput, { nullable: true })
  @Type(() => AccountCountOrderByAggregateInput)
  _count?: InstanceType<typeof AccountCountOrderByAggregateInput>;
  @Field(() => AccountAvgOrderByAggregateInput, { nullable: true })
  @Type(() => AccountAvgOrderByAggregateInput)
  _avg?: InstanceType<typeof AccountAvgOrderByAggregateInput>;
  @Field(() => AccountMaxOrderByAggregateInput, { nullable: true })
  @Type(() => AccountMaxOrderByAggregateInput)
  _max?: InstanceType<typeof AccountMaxOrderByAggregateInput>;
  @Field(() => AccountMinOrderByAggregateInput, { nullable: true })
  @Type(() => AccountMinOrderByAggregateInput)
  _min?: InstanceType<typeof AccountMinOrderByAggregateInput>;
  @Field(() => AccountSumOrderByAggregateInput, { nullable: true })
  @Type(() => AccountSumOrderByAggregateInput)
  _sum?: InstanceType<typeof AccountSumOrderByAggregateInput>;
}

@InputType()
export class AccountOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  description?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  isActive?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  institutionId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => UserOrderByWithRelationInput, { nullable: true })
  @Type(() => UserOrderByWithRelationInput)
  user?: InstanceType<typeof UserOrderByWithRelationInput>;
  @Field(() => InstitutionOrderByWithRelationInput, { nullable: true })
  @Type(() => InstitutionOrderByWithRelationInput)
  institution?: InstanceType<typeof InstitutionOrderByWithRelationInput>;
  @Field(() => AccountCardOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountCardOrderByWithRelationInput)
  accountCard?: InstanceType<typeof AccountCardOrderByWithRelationInput>;
  @Field(() => TransactionOrderByRelationAggregateInput, { nullable: true })
  @Type(() => TransactionOrderByRelationAggregateInput)
  sourceTransactions?: InstanceType<
    typeof TransactionOrderByRelationAggregateInput
  >;
  @Field(() => TransactionOrderByRelationAggregateInput, { nullable: true })
  @Type(() => TransactionOrderByRelationAggregateInput)
  destinyTransactions?: InstanceType<
    typeof TransactionOrderByRelationAggregateInput
  >;
  @Field(() => InvestmentOrderByRelationAggregateInput, { nullable: true })
  @Type(() => InvestmentOrderByRelationAggregateInput)
  investments?: InstanceType<typeof InvestmentOrderByRelationAggregateInput>;
  @Field(() => InvestmentTransactionOrderByRelationAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByRelationAggregateInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionOrderByRelationAggregateInput
  >;
}

@InputType()
export class AccountRelationFilter {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  is?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  isNot?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountScalarWhereWithAggregatesInput {
  @Field(() => [AccountScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => AccountScalarWhereWithAggregatesInput)
  AND?: Array<AccountScalarWhereWithAggregatesInput>;
  @Field(() => [AccountScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => AccountScalarWhereWithAggregatesInput)
  OR?: Array<AccountScalarWhereWithAggregatesInput>;
  @Field(() => [AccountScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => AccountScalarWhereWithAggregatesInput)
  NOT?: Array<AccountScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  name?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => EnumAccountTypeWithAggregatesFilter, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeWithAggregatesFilter>;
  @Field(() => DecimalWithAggregatesFilter, { nullable: true })
  @Type(() => DecimalWithAggregatesFilter)
  initialBalance?: InstanceType<typeof DecimalWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  description?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => BoolWithAggregatesFilter, { nullable: true })
  isActive?: InstanceType<typeof BoolWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  userId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  institutionId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class AccountScalarWhereInput {
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  AND?: Array<AccountScalarWhereInput>;
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  OR?: Array<AccountScalarWhereInput>;
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  NOT?: Array<AccountScalarWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => EnumAccountTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  initialBalance?: InstanceType<typeof DecimalFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  description?: InstanceType<typeof StringNullableFilter>;
  @Field(() => BoolFilter, { nullable: true })
  isActive?: InstanceType<typeof BoolFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  institutionId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class AccountSumAggregateInput {
  @Field(() => Boolean, { nullable: true })
  initialBalance?: true;
}

@ObjectType()
export class AccountSumAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  initialBalance?: Decimal;
}

@InputType()
export class AccountSumOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  initialBalance?: keyof typeof SortOrder;
}

@InputType()
export class AccountUncheckedCreateNestedManyWithoutInstitutionInput {
  @Field(() => [AccountCreateWithoutInstitutionInput], { nullable: true })
  @Type(() => AccountCreateWithoutInstitutionInput)
  create?: Array<AccountCreateWithoutInstitutionInput>;
  @Field(() => [AccountCreateOrConnectWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInstitutionInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutInstitutionInput>;
  @Field(() => AccountCreateManyInstitutionInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyInstitutionInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyInstitutionInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
}

@InputType()
export class AccountUncheckedCreateNestedManyWithoutUserInput {
  @Field(() => [AccountCreateWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateWithoutUserInput)
  create?: Array<AccountCreateWithoutUserInput>;
  @Field(() => [AccountCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutUserInput>;
  @Field(() => AccountCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyUserInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
}

@InputType()
export class AccountUncheckedCreateWithoutAccountCardInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateWithoutDestinyTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateWithoutInstitutionInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateWithoutInvestmentTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateWithoutInvestmentsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateWithoutSourceTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  initialBalance?: Decimal;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedCreateNestedOneWithoutAccountInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedCreateNestedOneWithoutAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutSourceAccountInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutSourceAccountInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutAccountInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutAccountInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput
  >;
}

@InputType()
export class AccountUncheckedUpdateManyWithoutInstitutionNestedInput {
  @Field(() => [AccountCreateWithoutInstitutionInput], { nullable: true })
  @Type(() => AccountCreateWithoutInstitutionInput)
  create?: Array<AccountCreateWithoutInstitutionInput>;
  @Field(() => [AccountCreateOrConnectWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInstitutionInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutInstitutionInput>;
  @Field(() => [AccountUpsertWithWhereUniqueWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountUpsertWithWhereUniqueWithoutInstitutionInput)
  upsert?: Array<AccountUpsertWithWhereUniqueWithoutInstitutionInput>;
  @Field(() => AccountCreateManyInstitutionInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyInstitutionInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyInstitutionInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  set?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountUpdateWithWhereUniqueWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountUpdateWithWhereUniqueWithoutInstitutionInput)
  update?: Array<AccountUpdateWithWhereUniqueWithoutInstitutionInput>;
  @Field(() => [AccountUpdateManyWithWhereWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountUpdateManyWithWhereWithoutInstitutionInput)
  updateMany?: Array<AccountUpdateManyWithWhereWithoutInstitutionInput>;
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  deleteMany?: Array<AccountScalarWhereInput>;
}

@InputType()
export class AccountUncheckedUpdateManyWithoutInstitutionInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountUncheckedUpdateManyWithoutUserNestedInput {
  @Field(() => [AccountCreateWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateWithoutUserInput)
  create?: Array<AccountCreateWithoutUserInput>;
  @Field(() => [AccountCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutUserInput>;
  @Field(() => [AccountUpsertWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => AccountUpsertWithWhereUniqueWithoutUserInput)
  upsert?: Array<AccountUpsertWithWhereUniqueWithoutUserInput>;
  @Field(() => AccountCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyUserInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  set?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountUpdateWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => AccountUpdateWithWhereUniqueWithoutUserInput)
  update?: Array<AccountUpdateWithWhereUniqueWithoutUserInput>;
  @Field(() => [AccountUpdateManyWithWhereWithoutUserInput], { nullable: true })
  @Type(() => AccountUpdateManyWithWhereWithoutUserInput)
  updateMany?: Array<AccountUpdateManyWithWhereWithoutUserInput>;
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  deleteMany?: Array<AccountScalarWhereInput>;
}

@InputType()
export class AccountUncheckedUpdateManyWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountUncheckedUpdateWithoutAccountCardInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateWithoutDestinyTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateWithoutInstitutionInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateWithoutInvestmentTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateWithoutInvestmentsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateWithoutSourceTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  institutionId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUncheckedUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUncheckedUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutAccountNestedInput
  >;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput,
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountUpdateManyWithWhereWithoutInstitutionInput {
  @Field(() => AccountScalarWhereInput, { nullable: false })
  @Type(() => AccountScalarWhereInput)
  where!: InstanceType<typeof AccountScalarWhereInput>;
  @Field(() => AccountUpdateManyMutationInput, { nullable: false })
  @Type(() => AccountUpdateManyMutationInput)
  data!: InstanceType<typeof AccountUpdateManyMutationInput>;
}

@InputType()
export class AccountUpdateManyWithWhereWithoutUserInput {
  @Field(() => AccountScalarWhereInput, { nullable: false })
  @Type(() => AccountScalarWhereInput)
  where!: InstanceType<typeof AccountScalarWhereInput>;
  @Field(() => AccountUpdateManyMutationInput, { nullable: false })
  @Type(() => AccountUpdateManyMutationInput)
  data!: InstanceType<typeof AccountUpdateManyMutationInput>;
}

@InputType()
export class AccountUpdateManyWithoutInstitutionNestedInput {
  @Field(() => [AccountCreateWithoutInstitutionInput], { nullable: true })
  @Type(() => AccountCreateWithoutInstitutionInput)
  create?: Array<AccountCreateWithoutInstitutionInput>;
  @Field(() => [AccountCreateOrConnectWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInstitutionInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutInstitutionInput>;
  @Field(() => [AccountUpsertWithWhereUniqueWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountUpsertWithWhereUniqueWithoutInstitutionInput)
  upsert?: Array<AccountUpsertWithWhereUniqueWithoutInstitutionInput>;
  @Field(() => AccountCreateManyInstitutionInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyInstitutionInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyInstitutionInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  set?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountUpdateWithWhereUniqueWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountUpdateWithWhereUniqueWithoutInstitutionInput)
  update?: Array<AccountUpdateWithWhereUniqueWithoutInstitutionInput>;
  @Field(() => [AccountUpdateManyWithWhereWithoutInstitutionInput], {
    nullable: true,
  })
  @Type(() => AccountUpdateManyWithWhereWithoutInstitutionInput)
  updateMany?: Array<AccountUpdateManyWithWhereWithoutInstitutionInput>;
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  deleteMany?: Array<AccountScalarWhereInput>;
}

@InputType()
export class AccountUpdateManyWithoutUserNestedInput {
  @Field(() => [AccountCreateWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateWithoutUserInput)
  create?: Array<AccountCreateWithoutUserInput>;
  @Field(() => [AccountCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => AccountCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<AccountCreateOrConnectWithoutUserInput>;
  @Field(() => [AccountUpsertWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => AccountUpsertWithWhereUniqueWithoutUserInput)
  upsert?: Array<AccountUpsertWithWhereUniqueWithoutUserInput>;
  @Field(() => AccountCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => AccountCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof AccountCreateManyUserInputEnvelope>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  set?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountWhereUniqueInput], { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<AccountWhereUniqueInput, 'id'>>;
  @Field(() => [AccountUpdateWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => AccountUpdateWithWhereUniqueWithoutUserInput)
  update?: Array<AccountUpdateWithWhereUniqueWithoutUserInput>;
  @Field(() => [AccountUpdateManyWithWhereWithoutUserInput], { nullable: true })
  @Type(() => AccountUpdateManyWithWhereWithoutUserInput)
  updateMany?: Array<AccountUpdateManyWithWhereWithoutUserInput>;
  @Field(() => [AccountScalarWhereInput], { nullable: true })
  @Type(() => AccountScalarWhereInput)
  deleteMany?: Array<AccountScalarWhereInput>;
}

@InputType()
export class AccountUpdateOneRequiredWithoutAccountCardNestedInput {
  @Field(() => AccountCreateWithoutAccountCardInput, { nullable: true })
  @Type(() => AccountCreateWithoutAccountCardInput)
  create?: InstanceType<typeof AccountCreateWithoutAccountCardInput>;
  @Field(() => AccountCreateOrConnectWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutAccountCardInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutAccountCardInput
  >;
  @Field(() => AccountUpsertWithoutAccountCardInput, { nullable: true })
  @Type(() => AccountUpsertWithoutAccountCardInput)
  upsert?: InstanceType<typeof AccountUpsertWithoutAccountCardInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateToOneWithWhereWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateToOneWithWhereWithoutAccountCardInput)
  update?: InstanceType<
    typeof AccountUpdateToOneWithWhereWithoutAccountCardInput
  >;
}

@InputType()
export class AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput {
  @Field(() => AccountCreateWithoutInvestmentTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateWithoutInvestmentTransactionsInput)
  create?: InstanceType<typeof AccountCreateWithoutInvestmentTransactionsInput>;
  @Field(() => AccountCreateOrConnectWithoutInvestmentTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInvestmentTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutInvestmentTransactionsInput
  >;
  @Field(() => AccountUpsertWithoutInvestmentTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountUpsertWithoutInvestmentTransactionsInput)
  upsert?: InstanceType<typeof AccountUpsertWithoutInvestmentTransactionsInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateToOneWithWhereWithoutInvestmentTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateToOneWithWhereWithoutInvestmentTransactionsInput)
  update?: InstanceType<
    typeof AccountUpdateToOneWithWhereWithoutInvestmentTransactionsInput
  >;
}

@InputType()
export class AccountUpdateOneRequiredWithoutInvestmentsNestedInput {
  @Field(() => AccountCreateWithoutInvestmentsInput, { nullable: true })
  @Type(() => AccountCreateWithoutInvestmentsInput)
  create?: InstanceType<typeof AccountCreateWithoutInvestmentsInput>;
  @Field(() => AccountCreateOrConnectWithoutInvestmentsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutInvestmentsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutInvestmentsInput
  >;
  @Field(() => AccountUpsertWithoutInvestmentsInput, { nullable: true })
  @Type(() => AccountUpsertWithoutInvestmentsInput)
  upsert?: InstanceType<typeof AccountUpsertWithoutInvestmentsInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateToOneWithWhereWithoutInvestmentsInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateToOneWithWhereWithoutInvestmentsInput)
  update?: InstanceType<
    typeof AccountUpdateToOneWithWhereWithoutInvestmentsInput
  >;
}

@InputType()
export class AccountUpdateOneWithoutDestinyTransactionsNestedInput {
  @Field(() => AccountCreateWithoutDestinyTransactionsInput, { nullable: true })
  @Type(() => AccountCreateWithoutDestinyTransactionsInput)
  create?: InstanceType<typeof AccountCreateWithoutDestinyTransactionsInput>;
  @Field(() => AccountCreateOrConnectWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutDestinyTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutDestinyTransactionsInput
  >;
  @Field(() => AccountUpsertWithoutDestinyTransactionsInput, { nullable: true })
  @Type(() => AccountUpsertWithoutDestinyTransactionsInput)
  upsert?: InstanceType<typeof AccountUpsertWithoutDestinyTransactionsInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  disconnect?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  delete?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateToOneWithWhereWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateToOneWithWhereWithoutDestinyTransactionsInput)
  update?: InstanceType<
    typeof AccountUpdateToOneWithWhereWithoutDestinyTransactionsInput
  >;
}

@InputType()
export class AccountUpdateOneWithoutSourceTransactionsNestedInput {
  @Field(() => AccountCreateWithoutSourceTransactionsInput, { nullable: true })
  @Type(() => AccountCreateWithoutSourceTransactionsInput)
  create?: InstanceType<typeof AccountCreateWithoutSourceTransactionsInput>;
  @Field(() => AccountCreateOrConnectWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateOrConnectWithoutSourceTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCreateOrConnectWithoutSourceTransactionsInput
  >;
  @Field(() => AccountUpsertWithoutSourceTransactionsInput, { nullable: true })
  @Type(() => AccountUpsertWithoutSourceTransactionsInput)
  upsert?: InstanceType<typeof AccountUpsertWithoutSourceTransactionsInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  disconnect?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  delete?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateToOneWithWhereWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateToOneWithWhereWithoutSourceTransactionsInput)
  update?: InstanceType<
    typeof AccountUpdateToOneWithWhereWithoutSourceTransactionsInput
  >;
}

@InputType()
export class AccountUpdateToOneWithWhereWithoutAccountCardInput {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountUpdateWithoutAccountCardInput, { nullable: false })
  @Type(() => AccountUpdateWithoutAccountCardInput)
  data!: InstanceType<typeof AccountUpdateWithoutAccountCardInput>;
}

@InputType()
export class AccountUpdateToOneWithWhereWithoutDestinyTransactionsInput {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountUpdateWithoutDestinyTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountUpdateWithoutDestinyTransactionsInput)
  data!: InstanceType<typeof AccountUpdateWithoutDestinyTransactionsInput>;
}

@InputType()
export class AccountUpdateToOneWithWhereWithoutInvestmentTransactionsInput {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountUpdateWithoutInvestmentTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountUpdateWithoutInvestmentTransactionsInput)
  data!: InstanceType<typeof AccountUpdateWithoutInvestmentTransactionsInput>;
}

@InputType()
export class AccountUpdateToOneWithWhereWithoutInvestmentsInput {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountUpdateWithoutInvestmentsInput, { nullable: false })
  @Type(() => AccountUpdateWithoutInvestmentsInput)
  data!: InstanceType<typeof AccountUpdateWithoutInvestmentsInput>;
}

@InputType()
export class AccountUpdateToOneWithWhereWithoutSourceTransactionsInput {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => AccountUpdateWithoutSourceTransactionsInput, { nullable: false })
  @Type(() => AccountUpdateWithoutSourceTransactionsInput)
  data!: InstanceType<typeof AccountUpdateWithoutSourceTransactionsInput>;
}

@InputType()
export class AccountUpdateWithWhereUniqueWithoutInstitutionInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateWithoutInstitutionInput, { nullable: false })
  @Type(() => AccountUpdateWithoutInstitutionInput)
  data!: InstanceType<typeof AccountUpdateWithoutInstitutionInput>;
}

@InputType()
export class AccountUpdateWithWhereUniqueWithoutUserInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateWithoutUserInput, { nullable: false })
  @Type(() => AccountUpdateWithoutUserInput)
  data!: InstanceType<typeof AccountUpdateWithoutUserInput>;
}

@InputType()
export class AccountUpdateWithoutAccountCardInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateWithoutDestinyTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateWithoutInstitutionInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateWithoutInvestmentTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateWithoutInvestmentsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateWithoutSourceTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumAccountTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  initialBalance?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => BoolFieldUpdateOperationsInput, { nullable: true })
  isActive?: InstanceType<typeof BoolFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutAccountsNestedInput)
  user?: InstanceType<typeof UserUpdateOneRequiredWithoutAccountsNestedInput>;
  @Field(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateOneRequiredWithoutAccountsNestedInput)
  institution?: InstanceType<
    typeof InstitutionUpdateOneRequiredWithoutAccountsNestedInput
  >;
  @Field(() => AccountCardUpdateOneWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneWithoutAccountNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneWithoutAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutSourceAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutSourceAccountNestedInput)
  sourceTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutSourceAccountNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutDestinyAccountNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutDestinyAccountNestedInput)
  destinyTransactions?: InstanceType<
    typeof TransactionUpdateManyWithoutDestinyAccountNestedInput
  >;
  @Field(() => InvestmentUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithoutAccountNestedInput)
  investments?: InstanceType<
    typeof InvestmentUpdateManyWithoutAccountNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutAccountNestedInput)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutAccountNestedInput
  >;
}

@InputType()
export class AccountUpsertWithWhereUniqueWithoutInstitutionInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateWithoutInstitutionInput, { nullable: false })
  @Type(() => AccountUpdateWithoutInstitutionInput)
  update!: InstanceType<typeof AccountUpdateWithoutInstitutionInput>;
  @Field(() => AccountCreateWithoutInstitutionInput, { nullable: false })
  @Type(() => AccountCreateWithoutInstitutionInput)
  create!: InstanceType<typeof AccountCreateWithoutInstitutionInput>;
}

@InputType()
export class AccountUpsertWithWhereUniqueWithoutUserInput {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountUpdateWithoutUserInput, { nullable: false })
  @Type(() => AccountUpdateWithoutUserInput)
  update!: InstanceType<typeof AccountUpdateWithoutUserInput>;
  @Field(() => AccountCreateWithoutUserInput, { nullable: false })
  @Type(() => AccountCreateWithoutUserInput)
  create!: InstanceType<typeof AccountCreateWithoutUserInput>;
}

@InputType()
export class AccountUpsertWithoutAccountCardInput {
  @Field(() => AccountUpdateWithoutAccountCardInput, { nullable: false })
  @Type(() => AccountUpdateWithoutAccountCardInput)
  update!: InstanceType<typeof AccountUpdateWithoutAccountCardInput>;
  @Field(() => AccountCreateWithoutAccountCardInput, { nullable: false })
  @Type(() => AccountCreateWithoutAccountCardInput)
  create!: InstanceType<typeof AccountCreateWithoutAccountCardInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountUpsertWithoutDestinyTransactionsInput {
  @Field(() => AccountUpdateWithoutDestinyTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountUpdateWithoutDestinyTransactionsInput)
  update!: InstanceType<typeof AccountUpdateWithoutDestinyTransactionsInput>;
  @Field(() => AccountCreateWithoutDestinyTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateWithoutDestinyTransactionsInput)
  create!: InstanceType<typeof AccountCreateWithoutDestinyTransactionsInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountUpsertWithoutInvestmentTransactionsInput {
  @Field(() => AccountUpdateWithoutInvestmentTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountUpdateWithoutInvestmentTransactionsInput)
  update!: InstanceType<typeof AccountUpdateWithoutInvestmentTransactionsInput>;
  @Field(() => AccountCreateWithoutInvestmentTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateWithoutInvestmentTransactionsInput)
  create!: InstanceType<typeof AccountCreateWithoutInvestmentTransactionsInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountUpsertWithoutInvestmentsInput {
  @Field(() => AccountUpdateWithoutInvestmentsInput, { nullable: false })
  @Type(() => AccountUpdateWithoutInvestmentsInput)
  update!: InstanceType<typeof AccountUpdateWithoutInvestmentsInput>;
  @Field(() => AccountCreateWithoutInvestmentsInput, { nullable: false })
  @Type(() => AccountCreateWithoutInvestmentsInput)
  create!: InstanceType<typeof AccountCreateWithoutInvestmentsInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountUpsertWithoutSourceTransactionsInput {
  @Field(() => AccountUpdateWithoutSourceTransactionsInput, { nullable: false })
  @Type(() => AccountUpdateWithoutSourceTransactionsInput)
  update!: InstanceType<typeof AccountUpdateWithoutSourceTransactionsInput>;
  @Field(() => AccountCreateWithoutSourceTransactionsInput, { nullable: false })
  @Type(() => AccountCreateWithoutSourceTransactionsInput)
  create!: InstanceType<typeof AccountCreateWithoutSourceTransactionsInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@InputType()
export class AccountWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => [AccountWhereInput], { nullable: true })
  @Type(() => AccountWhereInput)
  AND?: Array<AccountWhereInput>;
  @Field(() => [AccountWhereInput], { nullable: true })
  @Type(() => AccountWhereInput)
  OR?: Array<AccountWhereInput>;
  @Field(() => [AccountWhereInput], { nullable: true })
  @Type(() => AccountWhereInput)
  NOT?: Array<AccountWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => EnumAccountTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  initialBalance?: InstanceType<typeof DecimalFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  description?: InstanceType<typeof StringNullableFilter>;
  @Field(() => BoolFilter, { nullable: true })
  isActive?: InstanceType<typeof BoolFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  institutionId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  @Type(() => UserRelationFilter)
  user?: InstanceType<typeof UserRelationFilter>;
  @Field(() => InstitutionRelationFilter, { nullable: true })
  @Type(() => InstitutionRelationFilter)
  institution?: InstanceType<typeof InstitutionRelationFilter>;
  @Field(() => AccountCardNullableRelationFilter, { nullable: true })
  @Type(() => AccountCardNullableRelationFilter)
  accountCard?: InstanceType<typeof AccountCardNullableRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  sourceTransactions?: InstanceType<typeof TransactionListRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  destinyTransactions?: InstanceType<typeof TransactionListRelationFilter>;
  @Field(() => InvestmentListRelationFilter, { nullable: true })
  @Type(() => InvestmentListRelationFilter)
  investments?: InstanceType<typeof InvestmentListRelationFilter>;
  @Field(() => InvestmentTransactionListRelationFilter, { nullable: true })
  @Type(() => InvestmentTransactionListRelationFilter)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionListRelationFilter
  >;
}

@InputType()
export class AccountWhereInput {
  @Field(() => [AccountWhereInput], { nullable: true })
  @Type(() => AccountWhereInput)
  AND?: Array<AccountWhereInput>;
  @Field(() => [AccountWhereInput], { nullable: true })
  @Type(() => AccountWhereInput)
  OR?: Array<AccountWhereInput>;
  @Field(() => [AccountWhereInput], { nullable: true })
  @Type(() => AccountWhereInput)
  NOT?: Array<AccountWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => EnumAccountTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumAccountTypeFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  initialBalance?: InstanceType<typeof DecimalFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  description?: InstanceType<typeof StringNullableFilter>;
  @Field(() => BoolFilter, { nullable: true })
  isActive?: InstanceType<typeof BoolFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  institutionId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  @Type(() => UserRelationFilter)
  user?: InstanceType<typeof UserRelationFilter>;
  @Field(() => InstitutionRelationFilter, { nullable: true })
  @Type(() => InstitutionRelationFilter)
  institution?: InstanceType<typeof InstitutionRelationFilter>;
  @Field(() => AccountCardNullableRelationFilter, { nullable: true })
  @Type(() => AccountCardNullableRelationFilter)
  accountCard?: InstanceType<typeof AccountCardNullableRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  sourceTransactions?: InstanceType<typeof TransactionListRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  destinyTransactions?: InstanceType<typeof TransactionListRelationFilter>;
  @Field(() => InvestmentListRelationFilter, { nullable: true })
  @Type(() => InvestmentListRelationFilter)
  investments?: InstanceType<typeof InvestmentListRelationFilter>;
  @Field(() => InvestmentTransactionListRelationFilter, { nullable: true })
  @Type(() => InvestmentTransactionListRelationFilter)
  investmentTransactions?: InstanceType<
    typeof InvestmentTransactionListRelationFilter
  >;
}

@ObjectType()
export class Account {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => AccountType, { nullable: false })
  type!: keyof typeof AccountType;
  @Field(() => GraphQLDecimal, { nullable: false, defaultValue: 0 })
  initialBalance!: Decimal;
  @Field(() => String, { nullable: true })
  description!: string | null;
  @Field(() => Boolean, { nullable: false, defaultValue: true })
  isActive!: boolean;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  institutionId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => User, { nullable: false })
  user?: InstanceType<typeof User>;
  @Field(() => Institution, { nullable: false })
  institution?: InstanceType<typeof Institution>;
  @Field(() => AccountCard, { nullable: true })
  accountCard?: InstanceType<typeof AccountCard> | null;
  @Field(() => [Transaction], { nullable: true })
  sourceTransactions?: Array<Transaction>;
  @Field(() => [Transaction], { nullable: true })
  destinyTransactions?: Array<Transaction>;
  @Field(() => [Investment], { nullable: true })
  investments?: Array<Investment>;
  @Field(() => [InvestmentTransaction], { nullable: true })
  investmentTransactions?: Array<InvestmentTransaction>;
  @Field(() => AccountCount, { nullable: false })
  _count?: InstanceType<typeof AccountCount>;
}

@ObjectType()
export class AggregateAccount {
  @Field(() => AccountCountAggregate, { nullable: true })
  _count?: InstanceType<typeof AccountCountAggregate>;
  @Field(() => AccountAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof AccountAvgAggregate>;
  @Field(() => AccountSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof AccountSumAggregate>;
  @Field(() => AccountMinAggregate, { nullable: true })
  _min?: InstanceType<typeof AccountMinAggregate>;
  @Field(() => AccountMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof AccountMaxAggregate>;
}

@ArgsType()
export class CreateManyAccountArgs {
  @Field(() => [AccountCreateManyInput], { nullable: false })
  @Type(() => AccountCreateManyInput)
  data!: Array<AccountCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneAccountArgs {
  @Field(() => AccountCreateInput, { nullable: false })
  @Type(() => AccountCreateInput)
  data!: InstanceType<typeof AccountCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyAccountArgs {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@ArgsType()
export class DeleteOneAccountArgs {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstAccountOrThrowArgs {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => [AccountOrderByWithRelationInput], { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  orderBy?: Array<AccountOrderByWithRelationInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  cursor?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [AccountScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof AccountScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstAccountArgs {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => [AccountOrderByWithRelationInput], { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  orderBy?: Array<AccountOrderByWithRelationInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  cursor?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [AccountScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof AccountScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyAccountArgs {
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
  @Field(() => [AccountOrderByWithRelationInput], { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  orderBy?: Array<AccountOrderByWithRelationInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: true })
  @Type(() => AccountWhereUniqueInput)
  cursor?: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [AccountScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof AccountScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueAccountOrThrowArgs {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueAccountArgs {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpdateManyAccountArgs {
  @Field(() => AccountUpdateManyMutationInput, { nullable: false })
  @Type(() => AccountUpdateManyMutationInput)
  data!: InstanceType<typeof AccountUpdateManyMutationInput>;
  @Field(() => AccountWhereInput, { nullable: true })
  @Type(() => AccountWhereInput)
  where?: InstanceType<typeof AccountWhereInput>;
}

@ArgsType()
export class UpdateOneAccountArgs {
  @Field(() => AccountUpdateInput, { nullable: false })
  @Type(() => AccountUpdateInput)
  data!: InstanceType<typeof AccountUpdateInput>;
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneAccountArgs {
  @Field(() => AccountWhereUniqueInput, { nullable: false })
  @Type(() => AccountWhereUniqueInput)
  where!: Prisma.AtLeast<AccountWhereUniqueInput, 'id'>;
  @Field(() => AccountCreateInput, { nullable: false })
  @Type(() => AccountCreateInput)
  create!: InstanceType<typeof AccountCreateInput>;
  @Field(() => AccountUpdateInput, { nullable: false })
  @Type(() => AccountUpdateInput)
  update!: InstanceType<typeof AccountUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class AccountCardAggregateArgs {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => [AccountCardOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<AccountCardOrderByWithRelationInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => AccountCardCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof AccountCardCountAggregateInput>;
  @Field(() => AccountCardAvgAggregateInput, { nullable: true })
  _avg?: InstanceType<typeof AccountCardAvgAggregateInput>;
  @Field(() => AccountCardSumAggregateInput, { nullable: true })
  _sum?: InstanceType<typeof AccountCardSumAggregateInput>;
  @Field(() => AccountCardMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof AccountCardMinAggregateInput>;
  @Field(() => AccountCardMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof AccountCardMaxAggregateInput>;
}

@InputType()
export class AccountCardAvgAggregateInput {
  @Field(() => Boolean, { nullable: true })
  billingCycleDay?: true;
}

@ObjectType()
export class AccountCardAvgAggregate {
  @Field(() => Float, { nullable: true })
  billingCycleDay?: number;
}

@InputType()
export class AccountCardAvgOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  billingCycleDay?: keyof typeof SortOrder;
}

@InputType()
export class AccountCardCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  lastFourDigits?: true;
  @Field(() => Boolean, { nullable: true })
  billingCycleDay?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class AccountCardCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  lastFourDigits!: number;
  @Field(() => Int, { nullable: false })
  billingCycleDay!: number;
  @Field(() => Int, { nullable: false })
  type!: number;
  @Field(() => Int, { nullable: false })
  accountId!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class AccountCardCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  lastFourDigits?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  billingCycleDay?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@ObjectType()
export class AccountCardCount {
  @Field(() => Int, { nullable: false })
  billings?: number;
}

@InputType()
export class AccountCardCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCardCreateNestedOneWithoutAccountInput {
  @Field(() => AccountCardCreateWithoutAccountInput, { nullable: true })
  @Type(() => AccountCardCreateWithoutAccountInput)
  create?: InstanceType<typeof AccountCardCreateWithoutAccountInput>;
  @Field(() => AccountCardCreateOrConnectWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateOrConnectWithoutAccountInput)
  connectOrCreate?: InstanceType<
    typeof AccountCardCreateOrConnectWithoutAccountInput
  >;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  @Type(() => AccountCardWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
}

@InputType()
export class AccountCardCreateNestedOneWithoutBillingsInput {
  @Field(() => AccountCardCreateWithoutBillingsInput, { nullable: true })
  @Type(() => AccountCardCreateWithoutBillingsInput)
  create?: InstanceType<typeof AccountCardCreateWithoutBillingsInput>;
  @Field(() => AccountCardCreateOrConnectWithoutBillingsInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateOrConnectWithoutBillingsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCardCreateOrConnectWithoutBillingsInput
  >;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  @Type(() => AccountCardWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
}

@InputType()
export class AccountCardCreateOrConnectWithoutAccountInput {
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => AccountCardCreateWithoutAccountInput, { nullable: false })
  @Type(() => AccountCardCreateWithoutAccountInput)
  create!: InstanceType<typeof AccountCardCreateWithoutAccountInput>;
}

@InputType()
export class AccountCardCreateOrConnectWithoutBillingsInput {
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => AccountCardCreateWithoutBillingsInput, { nullable: false })
  @Type(() => AccountCardCreateWithoutBillingsInput)
  create!: InstanceType<typeof AccountCardCreateWithoutBillingsInput>;
}

@InputType()
export class AccountCardCreateWithoutAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => CardBillingCreateNestedManyWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateNestedManyWithoutAccountCardInput)
  billings?: InstanceType<
    typeof CardBillingCreateNestedManyWithoutAccountCardInput
  >;
}

@InputType()
export class AccountCardCreateWithoutBillingsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutAccountCardInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutAccountCardInput)
  account!: InstanceType<typeof AccountCreateNestedOneWithoutAccountCardInput>;
}

@InputType()
export class AccountCardCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutAccountCardInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutAccountCardInput)
  account!: InstanceType<typeof AccountCreateNestedOneWithoutAccountCardInput>;
  @Field(() => CardBillingCreateNestedManyWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateNestedManyWithoutAccountCardInput)
  billings?: InstanceType<
    typeof CardBillingCreateNestedManyWithoutAccountCardInput
  >;
}

@ArgsType()
export class AccountCardGroupByArgs {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => [AccountCardOrderByWithAggregationInput], { nullable: true })
  orderBy?: Array<AccountCardOrderByWithAggregationInput>;
  @Field(() => [AccountCardScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof AccountCardScalarFieldEnum>;
  @Field(() => AccountCardScalarWhereWithAggregatesInput, { nullable: true })
  having?: InstanceType<typeof AccountCardScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => AccountCardCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof AccountCardCountAggregateInput>;
  @Field(() => AccountCardAvgAggregateInput, { nullable: true })
  _avg?: InstanceType<typeof AccountCardAvgAggregateInput>;
  @Field(() => AccountCardSumAggregateInput, { nullable: true })
  _sum?: InstanceType<typeof AccountCardSumAggregateInput>;
  @Field(() => AccountCardMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof AccountCardMinAggregateInput>;
  @Field(() => AccountCardMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof AccountCardMaxAggregateInput>;
}

@ObjectType()
export class AccountCardGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => AccountCardCountAggregate, { nullable: true })
  _count?: InstanceType<typeof AccountCardCountAggregate>;
  @Field(() => AccountCardAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof AccountCardAvgAggregate>;
  @Field(() => AccountCardSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof AccountCardSumAggregate>;
  @Field(() => AccountCardMinAggregate, { nullable: true })
  _min?: InstanceType<typeof AccountCardMinAggregate>;
  @Field(() => AccountCardMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof AccountCardMaxAggregate>;
}

@InputType()
export class AccountCardMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  lastFourDigits?: true;
  @Field(() => Boolean, { nullable: true })
  billingCycleDay?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class AccountCardMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: true })
  type?: keyof typeof CardType;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCardMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  lastFourDigits?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  billingCycleDay?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class AccountCardMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  lastFourDigits?: true;
  @Field(() => Boolean, { nullable: true })
  billingCycleDay?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class AccountCardMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: true })
  type?: keyof typeof CardType;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCardMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  lastFourDigits?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  billingCycleDay?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class AccountCardNullableRelationFilter {
  @Field(() => AccountCardWhereInput, { nullable: true })
  is?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  isNot?: InstanceType<typeof AccountCardWhereInput>;
}

@InputType()
export class AccountCardOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  lastFourDigits?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountCardCountOrderByAggregateInput, { nullable: true })
  _count?: InstanceType<typeof AccountCardCountOrderByAggregateInput>;
  @Field(() => AccountCardAvgOrderByAggregateInput, { nullable: true })
  _avg?: InstanceType<typeof AccountCardAvgOrderByAggregateInput>;
  @Field(() => AccountCardMaxOrderByAggregateInput, { nullable: true })
  _max?: InstanceType<typeof AccountCardMaxOrderByAggregateInput>;
  @Field(() => AccountCardMinOrderByAggregateInput, { nullable: true })
  _min?: InstanceType<typeof AccountCardMinOrderByAggregateInput>;
  @Field(() => AccountCardSumOrderByAggregateInput, { nullable: true })
  _sum?: InstanceType<typeof AccountCardSumOrderByAggregateInput>;
}

@InputType()
export class AccountCardOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  lastFourDigits?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  account?: InstanceType<typeof AccountOrderByWithRelationInput>;
  @Field(() => CardBillingOrderByRelationAggregateInput, { nullable: true })
  @Type(() => CardBillingOrderByRelationAggregateInput)
  billings?: InstanceType<typeof CardBillingOrderByRelationAggregateInput>;
}

@InputType()
export class AccountCardRelationFilter {
  @Field(() => AccountCardWhereInput, { nullable: true })
  is?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  isNot?: InstanceType<typeof AccountCardWhereInput>;
}

@InputType()
export class AccountCardScalarWhereWithAggregatesInput {
  @Field(() => [AccountCardScalarWhereWithAggregatesInput], { nullable: true })
  AND?: Array<AccountCardScalarWhereWithAggregatesInput>;
  @Field(() => [AccountCardScalarWhereWithAggregatesInput], { nullable: true })
  OR?: Array<AccountCardScalarWhereWithAggregatesInput>;
  @Field(() => [AccountCardScalarWhereWithAggregatesInput], { nullable: true })
  NOT?: Array<AccountCardScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  lastFourDigits?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => IntNullableWithAggregatesFilter, { nullable: true })
  billingCycleDay?: InstanceType<typeof IntNullableWithAggregatesFilter>;
  @Field(() => EnumCardTypeWithAggregatesFilter, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  accountId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class AccountCardSumAggregateInput {
  @Field(() => Boolean, { nullable: true })
  billingCycleDay?: true;
}

@ObjectType()
export class AccountCardSumAggregate {
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
}

@InputType()
export class AccountCardSumOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  billingCycleDay?: keyof typeof SortOrder;
}

@InputType()
export class AccountCardUncheckedCreateNestedOneWithoutAccountInput {
  @Field(() => AccountCardCreateWithoutAccountInput, { nullable: true })
  @Type(() => AccountCardCreateWithoutAccountInput)
  create?: InstanceType<typeof AccountCardCreateWithoutAccountInput>;
  @Field(() => AccountCardCreateOrConnectWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateOrConnectWithoutAccountInput)
  connectOrCreate?: InstanceType<
    typeof AccountCardCreateOrConnectWithoutAccountInput
  >;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  @Type(() => AccountCardWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
}

@InputType()
export class AccountCardUncheckedCreateWithoutAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => CardBillingUncheckedCreateNestedManyWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => CardBillingUncheckedCreateNestedManyWithoutAccountCardInput)
  billings?: InstanceType<
    typeof CardBillingUncheckedCreateNestedManyWithoutAccountCardInput
  >;
}

@InputType()
export class AccountCardUncheckedCreateWithoutBillingsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class AccountCardUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  lastFourDigits?: string;
  @Field(() => Int, { nullable: true })
  billingCycleDay?: number;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => CardBillingUncheckedCreateNestedManyWithoutAccountCardInput, {
    nullable: true,
  })
  @Type(() => CardBillingUncheckedCreateNestedManyWithoutAccountCardInput)
  billings?: InstanceType<
    typeof CardBillingUncheckedCreateNestedManyWithoutAccountCardInput
  >;
}

@InputType()
export class AccountCardUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountCardUncheckedUpdateOneWithoutAccountNestedInput {
  @Field(() => AccountCardCreateWithoutAccountInput, { nullable: true })
  @Type(() => AccountCardCreateWithoutAccountInput)
  create?: InstanceType<typeof AccountCardCreateWithoutAccountInput>;
  @Field(() => AccountCardCreateOrConnectWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateOrConnectWithoutAccountInput)
  connectOrCreate?: InstanceType<
    typeof AccountCardCreateOrConnectWithoutAccountInput
  >;
  @Field(() => AccountCardUpsertWithoutAccountInput, { nullable: true })
  @Type(() => AccountCardUpsertWithoutAccountInput)
  upsert?: InstanceType<typeof AccountCardUpsertWithoutAccountInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  disconnect?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  delete?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  @Type(() => AccountCardWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => AccountCardUpdateToOneWithWhereWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateToOneWithWhereWithoutAccountInput)
  update?: InstanceType<
    typeof AccountCardUpdateToOneWithWhereWithoutAccountInput
  >;
}

@InputType()
export class AccountCardUncheckedUpdateWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput)
  billings?: InstanceType<
    typeof CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput
  >;
}

@InputType()
export class AccountCardUncheckedUpdateWithoutBillingsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountCardUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput)
  billings?: InstanceType<
    typeof CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput
  >;
}

@InputType()
export class AccountCardUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class AccountCardUpdateOneRequiredWithoutBillingsNestedInput {
  @Field(() => AccountCardCreateWithoutBillingsInput, { nullable: true })
  @Type(() => AccountCardCreateWithoutBillingsInput)
  create?: InstanceType<typeof AccountCardCreateWithoutBillingsInput>;
  @Field(() => AccountCardCreateOrConnectWithoutBillingsInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateOrConnectWithoutBillingsInput)
  connectOrCreate?: InstanceType<
    typeof AccountCardCreateOrConnectWithoutBillingsInput
  >;
  @Field(() => AccountCardUpsertWithoutBillingsInput, { nullable: true })
  @Type(() => AccountCardUpsertWithoutBillingsInput)
  upsert?: InstanceType<typeof AccountCardUpsertWithoutBillingsInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  @Type(() => AccountCardWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => AccountCardUpdateToOneWithWhereWithoutBillingsInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateToOneWithWhereWithoutBillingsInput)
  update?: InstanceType<
    typeof AccountCardUpdateToOneWithWhereWithoutBillingsInput
  >;
}

@InputType()
export class AccountCardUpdateOneWithoutAccountNestedInput {
  @Field(() => AccountCardCreateWithoutAccountInput, { nullable: true })
  @Type(() => AccountCardCreateWithoutAccountInput)
  create?: InstanceType<typeof AccountCardCreateWithoutAccountInput>;
  @Field(() => AccountCardCreateOrConnectWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardCreateOrConnectWithoutAccountInput)
  connectOrCreate?: InstanceType<
    typeof AccountCardCreateOrConnectWithoutAccountInput
  >;
  @Field(() => AccountCardUpsertWithoutAccountInput, { nullable: true })
  @Type(() => AccountCardUpsertWithoutAccountInput)
  upsert?: InstanceType<typeof AccountCardUpsertWithoutAccountInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  disconnect?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  delete?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  @Type(() => AccountCardWhereUniqueInput)
  connect?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => AccountCardUpdateToOneWithWhereWithoutAccountInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateToOneWithWhereWithoutAccountInput)
  update?: InstanceType<
    typeof AccountCardUpdateToOneWithWhereWithoutAccountInput
  >;
}

@InputType()
export class AccountCardUpdateToOneWithWhereWithoutAccountInput {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardUpdateWithoutAccountInput, { nullable: false })
  @Type(() => AccountCardUpdateWithoutAccountInput)
  data!: InstanceType<typeof AccountCardUpdateWithoutAccountInput>;
}

@InputType()
export class AccountCardUpdateToOneWithWhereWithoutBillingsInput {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => AccountCardUpdateWithoutBillingsInput, { nullable: false })
  @Type(() => AccountCardUpdateWithoutBillingsInput)
  data!: InstanceType<typeof AccountCardUpdateWithoutBillingsInput>;
}

@InputType()
export class AccountCardUpdateWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => CardBillingUpdateManyWithoutAccountCardNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateManyWithoutAccountCardNestedInput)
  billings?: InstanceType<
    typeof CardBillingUpdateManyWithoutAccountCardNestedInput
  >;
}

@InputType()
export class AccountCardUpdateWithoutBillingsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneRequiredWithoutAccountCardNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneRequiredWithoutAccountCardNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutAccountCardNestedInput
  >;
}

@InputType()
export class AccountCardUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  lastFourDigits?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  billingCycleDay?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => EnumCardTypeFieldUpdateOperationsInput, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneRequiredWithoutAccountCardNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneRequiredWithoutAccountCardNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutAccountCardNestedInput
  >;
  @Field(() => CardBillingUpdateManyWithoutAccountCardNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateManyWithoutAccountCardNestedInput)
  billings?: InstanceType<
    typeof CardBillingUpdateManyWithoutAccountCardNestedInput
  >;
}

@InputType()
export class AccountCardUpsertWithoutAccountInput {
  @Field(() => AccountCardUpdateWithoutAccountInput, { nullable: false })
  @Type(() => AccountCardUpdateWithoutAccountInput)
  update!: InstanceType<typeof AccountCardUpdateWithoutAccountInput>;
  @Field(() => AccountCardCreateWithoutAccountInput, { nullable: false })
  @Type(() => AccountCardCreateWithoutAccountInput)
  create!: InstanceType<typeof AccountCardCreateWithoutAccountInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
}

@InputType()
export class AccountCardUpsertWithoutBillingsInput {
  @Field(() => AccountCardUpdateWithoutBillingsInput, { nullable: false })
  @Type(() => AccountCardUpdateWithoutBillingsInput)
  update!: InstanceType<typeof AccountCardUpdateWithoutBillingsInput>;
  @Field(() => AccountCardCreateWithoutBillingsInput, { nullable: false })
  @Type(() => AccountCardCreateWithoutBillingsInput)
  create!: InstanceType<typeof AccountCardCreateWithoutBillingsInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
}

@InputType()
export class AccountCardWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => [AccountCardWhereInput], { nullable: true })
  AND?: Array<AccountCardWhereInput>;
  @Field(() => [AccountCardWhereInput], { nullable: true })
  OR?: Array<AccountCardWhereInput>;
  @Field(() => [AccountCardWhereInput], { nullable: true })
  NOT?: Array<AccountCardWhereInput>;
  @Field(() => StringNullableFilter, { nullable: true })
  lastFourDigits?: InstanceType<typeof StringNullableFilter>;
  @Field(() => IntNullableFilter, { nullable: true })
  billingCycleDay?: InstanceType<typeof IntNullableFilter>;
  @Field(() => EnumCardTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountRelationFilter, { nullable: true })
  @Type(() => AccountRelationFilter)
  account?: InstanceType<typeof AccountRelationFilter>;
  @Field(() => CardBillingListRelationFilter, { nullable: true })
  @Type(() => CardBillingListRelationFilter)
  billings?: InstanceType<typeof CardBillingListRelationFilter>;
}

@InputType()
export class AccountCardWhereInput {
  @Field(() => [AccountCardWhereInput], { nullable: true })
  AND?: Array<AccountCardWhereInput>;
  @Field(() => [AccountCardWhereInput], { nullable: true })
  OR?: Array<AccountCardWhereInput>;
  @Field(() => [AccountCardWhereInput], { nullable: true })
  NOT?: Array<AccountCardWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  lastFourDigits?: InstanceType<typeof StringNullableFilter>;
  @Field(() => IntNullableFilter, { nullable: true })
  billingCycleDay?: InstanceType<typeof IntNullableFilter>;
  @Field(() => EnumCardTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumCardTypeFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountRelationFilter, { nullable: true })
  @Type(() => AccountRelationFilter)
  account?: InstanceType<typeof AccountRelationFilter>;
  @Field(() => CardBillingListRelationFilter, { nullable: true })
  @Type(() => CardBillingListRelationFilter)
  billings?: InstanceType<typeof CardBillingListRelationFilter>;
}

@ObjectType()
export class AccountCard {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: true })
  lastFourDigits!: string | null;
  @Field(() => Int, { nullable: true })
  billingCycleDay!: number | null;
  @Field(() => CardType, { nullable: false })
  type!: keyof typeof CardType;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => Account, { nullable: false })
  account?: InstanceType<typeof Account>;
  @Field(() => [CardBilling], { nullable: true })
  billings?: Array<CardBilling>;
  @Field(() => AccountCardCount, { nullable: false })
  _count?: InstanceType<typeof AccountCardCount>;
}

@ObjectType()
export class AggregateAccountCard {
  @Field(() => AccountCardCountAggregate, { nullable: true })
  _count?: InstanceType<typeof AccountCardCountAggregate>;
  @Field(() => AccountCardAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof AccountCardAvgAggregate>;
  @Field(() => AccountCardSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof AccountCardSumAggregate>;
  @Field(() => AccountCardMinAggregate, { nullable: true })
  _min?: InstanceType<typeof AccountCardMinAggregate>;
  @Field(() => AccountCardMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof AccountCardMaxAggregate>;
}

@ArgsType()
export class CreateManyAccountCardArgs {
  @Field(() => [AccountCardCreateManyInput], { nullable: false })
  @Type(() => AccountCardCreateManyInput)
  data!: Array<AccountCardCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneAccountCardArgs {
  @Field(() => AccountCardCreateInput, { nullable: false })
  @Type(() => AccountCardCreateInput)
  data!: InstanceType<typeof AccountCardCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyAccountCardArgs {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
}

@ArgsType()
export class DeleteOneAccountCardArgs {
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstAccountCardOrThrowArgs {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => [AccountCardOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<AccountCardOrderByWithRelationInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [AccountCardScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof AccountCardScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstAccountCardArgs {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => [AccountCardOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<AccountCardOrderByWithRelationInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [AccountCardScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof AccountCardScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyAccountCardArgs {
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
  @Field(() => [AccountCardOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<AccountCardOrderByWithRelationInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [AccountCardScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof AccountCardScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueAccountCardOrThrowArgs {
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueAccountCardArgs {
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpdateManyAccountCardArgs {
  @Field(() => AccountCardUpdateManyMutationInput, { nullable: false })
  @Type(() => AccountCardUpdateManyMutationInput)
  data!: InstanceType<typeof AccountCardUpdateManyMutationInput>;
  @Field(() => AccountCardWhereInput, { nullable: true })
  @Type(() => AccountCardWhereInput)
  where?: InstanceType<typeof AccountCardWhereInput>;
}

@ArgsType()
export class UpdateOneAccountCardArgs {
  @Field(() => AccountCardUpdateInput, { nullable: false })
  @Type(() => AccountCardUpdateInput)
  data!: InstanceType<typeof AccountCardUpdateInput>;
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneAccountCardArgs {
  @Field(() => AccountCardWhereUniqueInput, { nullable: false })
  @Type(() => AccountCardWhereUniqueInput)
  where!: Prisma.AtLeast<AccountCardWhereUniqueInput, 'id' | 'accountId'>;
  @Field(() => AccountCardCreateInput, { nullable: false })
  @Type(() => AccountCardCreateInput)
  create!: InstanceType<typeof AccountCardCreateInput>;
  @Field(() => AccountCardUpdateInput, { nullable: false })
  @Type(() => AccountCardUpdateInput)
  update!: InstanceType<typeof AccountCardUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ObjectType()
export class AggregateCardBilling {
  @Field(() => CardBillingCountAggregate, { nullable: true })
  _count?: InstanceType<typeof CardBillingCountAggregate>;
  @Field(() => CardBillingAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof CardBillingAvgAggregate>;
  @Field(() => CardBillingSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof CardBillingSumAggregate>;
  @Field(() => CardBillingMinAggregate, { nullable: true })
  _min?: InstanceType<typeof CardBillingMinAggregate>;
  @Field(() => CardBillingMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof CardBillingMaxAggregate>;
}

@InputType()
export class CardBillingAccountCardIdPeriodStartCompoundUniqueInput {
  @Field(() => String, { nullable: false })
  accountCardId!: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
}

@ArgsType()
export class CardBillingAggregateArgs {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => [CardBillingOrderByWithRelationInput], { nullable: true })
  @Type(() => CardBillingOrderByWithRelationInput)
  orderBy?: Array<CardBillingOrderByWithRelationInput>;
  @Field(() => CardBillingWhereUniqueInput, { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  cursor?: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => CardBillingCountAggregateInput, { nullable: true })
  @Type(() => CardBillingCountAggregateInput)
  _count?: InstanceType<typeof CardBillingCountAggregateInput>;
  @Field(() => CardBillingAvgAggregateInput, { nullable: true })
  @Type(() => CardBillingAvgAggregateInput)
  _avg?: InstanceType<typeof CardBillingAvgAggregateInput>;
  @Field(() => CardBillingSumAggregateInput, { nullable: true })
  @Type(() => CardBillingSumAggregateInput)
  _sum?: InstanceType<typeof CardBillingSumAggregateInput>;
  @Field(() => CardBillingMinAggregateInput, { nullable: true })
  @Type(() => CardBillingMinAggregateInput)
  _min?: InstanceType<typeof CardBillingMinAggregateInput>;
  @Field(() => CardBillingMaxAggregateInput, { nullable: true })
  @Type(() => CardBillingMaxAggregateInput)
  _max?: InstanceType<typeof CardBillingMaxAggregateInput>;
}

@InputType()
export class CardBillingAvgAggregateInput {
  @Field(() => Boolean, { nullable: true })
  totalAmount?: true;
  @Field(() => Boolean, { nullable: true })
  paidAmount?: true;
  @Field(() => Boolean, { nullable: true })
  minimumPayment?: true;
}

@ObjectType()
export class CardBillingAvgAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  minimumPayment?: Decimal;
}

@InputType()
export class CardBillingAvgOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  minimumPayment?: keyof typeof SortOrder;
}

@InputType()
export class CardBillingCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  periodStart?: true;
  @Field(() => Boolean, { nullable: true })
  periodEnd?: true;
  @Field(() => Boolean, { nullable: true })
  dueDate?: true;
  @Field(() => Boolean, { nullable: true })
  closingDate?: true;
  @Field(() => Boolean, { nullable: true })
  totalAmount?: true;
  @Field(() => Boolean, { nullable: true })
  paidAmount?: true;
  @Field(() => Boolean, { nullable: true })
  minimumPayment?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  accountCardId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class CardBillingCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  periodStart!: number;
  @Field(() => Int, { nullable: false })
  periodEnd!: number;
  @Field(() => Int, { nullable: false })
  dueDate!: number;
  @Field(() => Int, { nullable: false })
  closingDate!: number;
  @Field(() => Int, { nullable: false })
  totalAmount!: number;
  @Field(() => Int, { nullable: false })
  paidAmount!: number;
  @Field(() => Int, { nullable: false })
  minimumPayment!: number;
  @Field(() => Int, { nullable: false })
  status!: number;
  @Field(() => Int, { nullable: false })
  accountCardId!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class CardBillingCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodStart?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodEnd?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  dueDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  closingDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  minimumPayment?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountCardId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@ObjectType()
export class CardBillingCount {
  @Field(() => Int, { nullable: false })
  transactions?: number;
}

@InputType()
export class CardBillingCreateManyAccountCardInputEnvelope {
  @Field(() => [CardBillingCreateManyAccountCardInput], { nullable: false })
  @Type(() => CardBillingCreateManyAccountCardInput)
  data!: Array<CardBillingCreateManyAccountCardInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class CardBillingCreateManyAccountCardInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class CardBillingCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: false })
  accountCardId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class CardBillingCreateNestedManyWithoutAccountCardInput {
  @Field(() => [CardBillingCreateWithoutAccountCardInput], { nullable: true })
  @Type(() => CardBillingCreateWithoutAccountCardInput)
  create?: Array<CardBillingCreateWithoutAccountCardInput>;
  @Field(() => [CardBillingCreateOrConnectWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingCreateOrConnectWithoutAccountCardInput)
  connectOrCreate?: Array<CardBillingCreateOrConnectWithoutAccountCardInput>;
  @Field(() => CardBillingCreateManyAccountCardInputEnvelope, {
    nullable: true,
  })
  @Type(() => CardBillingCreateManyAccountCardInputEnvelope)
  createMany?: InstanceType<
    typeof CardBillingCreateManyAccountCardInputEnvelope
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  connect?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
}

@InputType()
export class CardBillingCreateNestedOneWithoutTransactionsInput {
  @Field(() => CardBillingCreateWithoutTransactionsInput, { nullable: true })
  @Type(() => CardBillingCreateWithoutTransactionsInput)
  create?: InstanceType<typeof CardBillingCreateWithoutTransactionsInput>;
  @Field(() => CardBillingCreateOrConnectWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateOrConnectWithoutTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof CardBillingCreateOrConnectWithoutTransactionsInput
  >;
  @Field(() => CardBillingWhereUniqueInput, { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  connect?: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
}

@InputType()
export class CardBillingCreateOrConnectWithoutAccountCardInput {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => CardBillingCreateWithoutAccountCardInput, { nullable: false })
  @Type(() => CardBillingCreateWithoutAccountCardInput)
  create!: InstanceType<typeof CardBillingCreateWithoutAccountCardInput>;
}

@InputType()
export class CardBillingCreateOrConnectWithoutTransactionsInput {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => CardBillingCreateWithoutTransactionsInput, { nullable: false })
  @Type(() => CardBillingCreateWithoutTransactionsInput)
  create!: InstanceType<typeof CardBillingCreateWithoutTransactionsInput>;
}

@InputType()
export class CardBillingCreateWithoutAccountCardInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => TransactionCreateNestedManyWithoutCardBillingInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutCardBillingInput)
  transactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutCardBillingInput
  >;
}

@InputType()
export class CardBillingCreateWithoutTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardCreateNestedOneWithoutBillingsInput, {
    nullable: false,
  })
  @Type(() => AccountCardCreateNestedOneWithoutBillingsInput)
  accountCard!: InstanceType<
    typeof AccountCardCreateNestedOneWithoutBillingsInput
  >;
}

@InputType()
export class CardBillingCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCardCreateNestedOneWithoutBillingsInput, {
    nullable: false,
  })
  @Type(() => AccountCardCreateNestedOneWithoutBillingsInput)
  accountCard!: InstanceType<
    typeof AccountCardCreateNestedOneWithoutBillingsInput
  >;
  @Field(() => TransactionCreateNestedManyWithoutCardBillingInput, {
    nullable: true,
  })
  @Type(() => TransactionCreateNestedManyWithoutCardBillingInput)
  transactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutCardBillingInput
  >;
}

@ArgsType()
export class CardBillingGroupByArgs {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => [CardBillingOrderByWithAggregationInput], { nullable: true })
  @Type(() => CardBillingOrderByWithAggregationInput)
  orderBy?: Array<CardBillingOrderByWithAggregationInput>;
  @Field(() => [CardBillingScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof CardBillingScalarFieldEnum>;
  @Field(() => CardBillingScalarWhereWithAggregatesInput, { nullable: true })
  @Type(() => CardBillingScalarWhereWithAggregatesInput)
  having?: InstanceType<typeof CardBillingScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => CardBillingCountAggregateInput, { nullable: true })
  @Type(() => CardBillingCountAggregateInput)
  _count?: InstanceType<typeof CardBillingCountAggregateInput>;
  @Field(() => CardBillingAvgAggregateInput, { nullable: true })
  @Type(() => CardBillingAvgAggregateInput)
  _avg?: InstanceType<typeof CardBillingAvgAggregateInput>;
  @Field(() => CardBillingSumAggregateInput, { nullable: true })
  @Type(() => CardBillingSumAggregateInput)
  _sum?: InstanceType<typeof CardBillingSumAggregateInput>;
  @Field(() => CardBillingMinAggregateInput, { nullable: true })
  @Type(() => CardBillingMinAggregateInput)
  _min?: InstanceType<typeof CardBillingMinAggregateInput>;
  @Field(() => CardBillingMaxAggregateInput, { nullable: true })
  @Type(() => CardBillingMaxAggregateInput)
  _max?: InstanceType<typeof CardBillingMaxAggregateInput>;
}

@ObjectType()
export class CardBillingGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: false })
  totalAmount!: Decimal;
  @Field(() => GraphQLDecimal, { nullable: false })
  paidAmount!: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: false })
  accountCardId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => CardBillingCountAggregate, { nullable: true })
  _count?: InstanceType<typeof CardBillingCountAggregate>;
  @Field(() => CardBillingAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof CardBillingAvgAggregate>;
  @Field(() => CardBillingSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof CardBillingSumAggregate>;
  @Field(() => CardBillingMinAggregate, { nullable: true })
  _min?: InstanceType<typeof CardBillingMinAggregate>;
  @Field(() => CardBillingMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof CardBillingMaxAggregate>;
}

@InputType()
export class CardBillingListRelationFilter {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  every?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  some?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  none?: InstanceType<typeof CardBillingWhereInput>;
}

@InputType()
export class CardBillingMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  periodStart?: true;
  @Field(() => Boolean, { nullable: true })
  periodEnd?: true;
  @Field(() => Boolean, { nullable: true })
  dueDate?: true;
  @Field(() => Boolean, { nullable: true })
  closingDate?: true;
  @Field(() => Boolean, { nullable: true })
  totalAmount?: true;
  @Field(() => Boolean, { nullable: true })
  paidAmount?: true;
  @Field(() => Boolean, { nullable: true })
  minimumPayment?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  accountCardId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class CardBillingMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: true })
  periodStart?: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: true })
  status?: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: true })
  accountCardId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class CardBillingMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodStart?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodEnd?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  dueDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  closingDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  minimumPayment?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountCardId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class CardBillingMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  periodStart?: true;
  @Field(() => Boolean, { nullable: true })
  periodEnd?: true;
  @Field(() => Boolean, { nullable: true })
  dueDate?: true;
  @Field(() => Boolean, { nullable: true })
  closingDate?: true;
  @Field(() => Boolean, { nullable: true })
  totalAmount?: true;
  @Field(() => Boolean, { nullable: true })
  paidAmount?: true;
  @Field(() => Boolean, { nullable: true })
  minimumPayment?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  accountCardId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class CardBillingMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: true })
  periodStart?: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: true })
  status?: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: true })
  accountCardId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class CardBillingMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodStart?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodEnd?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  dueDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  closingDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  minimumPayment?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountCardId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class CardBillingNullableRelationFilter {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  is?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  isNot?: InstanceType<typeof CardBillingWhereInput>;
}

@InputType()
export class CardBillingOrderByRelationAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  _count?: keyof typeof SortOrder;
}

@InputType()
export class CardBillingOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodStart?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  periodEnd?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  dueDate?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  closingDate?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  @Type(() => SortOrderInput)
  minimumPayment?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountCardId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => CardBillingCountOrderByAggregateInput, { nullable: true })
  @Type(() => CardBillingCountOrderByAggregateInput)
  _count?: InstanceType<typeof CardBillingCountOrderByAggregateInput>;
  @Field(() => CardBillingAvgOrderByAggregateInput, { nullable: true })
  @Type(() => CardBillingAvgOrderByAggregateInput)
  _avg?: InstanceType<typeof CardBillingAvgOrderByAggregateInput>;
  @Field(() => CardBillingMaxOrderByAggregateInput, { nullable: true })
  @Type(() => CardBillingMaxOrderByAggregateInput)
  _max?: InstanceType<typeof CardBillingMaxOrderByAggregateInput>;
  @Field(() => CardBillingMinOrderByAggregateInput, { nullable: true })
  @Type(() => CardBillingMinOrderByAggregateInput)
  _min?: InstanceType<typeof CardBillingMinOrderByAggregateInput>;
  @Field(() => CardBillingSumOrderByAggregateInput, { nullable: true })
  @Type(() => CardBillingSumOrderByAggregateInput)
  _sum?: InstanceType<typeof CardBillingSumOrderByAggregateInput>;
}

@InputType()
export class CardBillingOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  periodStart?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  periodEnd?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  dueDate?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  closingDate?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  @Type(() => SortOrderInput)
  minimumPayment?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountCardId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountCardOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountCardOrderByWithRelationInput)
  accountCard?: InstanceType<typeof AccountCardOrderByWithRelationInput>;
  @Field(() => TransactionOrderByRelationAggregateInput, { nullable: true })
  @Type(() => TransactionOrderByRelationAggregateInput)
  transactions?: InstanceType<typeof TransactionOrderByRelationAggregateInput>;
}

@InputType()
export class CardBillingScalarWhereWithAggregatesInput {
  @Field(() => [CardBillingScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => CardBillingScalarWhereWithAggregatesInput)
  AND?: Array<CardBillingScalarWhereWithAggregatesInput>;
  @Field(() => [CardBillingScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => CardBillingScalarWhereWithAggregatesInput)
  OR?: Array<CardBillingScalarWhereWithAggregatesInput>;
  @Field(() => [CardBillingScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => CardBillingScalarWhereWithAggregatesInput)
  NOT?: Array<CardBillingScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeNullableWithAggregatesFilter, { nullable: true })
  periodEnd?: InstanceType<typeof DateTimeNullableWithAggregatesFilter>;
  @Field(() => DateTimeNullableWithAggregatesFilter, { nullable: true })
  dueDate?: InstanceType<typeof DateTimeNullableWithAggregatesFilter>;
  @Field(() => DateTimeNullableWithAggregatesFilter, { nullable: true })
  closingDate?: InstanceType<typeof DateTimeNullableWithAggregatesFilter>;
  @Field(() => DecimalWithAggregatesFilter, { nullable: true })
  @Type(() => DecimalWithAggregatesFilter)
  totalAmount?: InstanceType<typeof DecimalWithAggregatesFilter>;
  @Field(() => DecimalWithAggregatesFilter, { nullable: true })
  @Type(() => DecimalWithAggregatesFilter)
  paidAmount?: InstanceType<typeof DecimalWithAggregatesFilter>;
  @Field(() => DecimalNullableWithAggregatesFilter, { nullable: true })
  @Type(() => DecimalNullableWithAggregatesFilter)
  minimumPayment?: InstanceType<typeof DecimalNullableWithAggregatesFilter>;
  @Field(() => EnumCardBillingStatusWithAggregatesFilter, { nullable: true })
  status?: InstanceType<typeof EnumCardBillingStatusWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  accountCardId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class CardBillingScalarWhereInput {
  @Field(() => [CardBillingScalarWhereInput], { nullable: true })
  @Type(() => CardBillingScalarWhereInput)
  AND?: Array<CardBillingScalarWhereInput>;
  @Field(() => [CardBillingScalarWhereInput], { nullable: true })
  @Type(() => CardBillingScalarWhereInput)
  OR?: Array<CardBillingScalarWhereInput>;
  @Field(() => [CardBillingScalarWhereInput], { nullable: true })
  @Type(() => CardBillingScalarWhereInput)
  NOT?: Array<CardBillingScalarWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  periodEnd?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  dueDate?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  closingDate?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  totalAmount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  paidAmount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DecimalNullableFilter, { nullable: true })
  @Type(() => DecimalNullableFilter)
  minimumPayment?: InstanceType<typeof DecimalNullableFilter>;
  @Field(() => EnumCardBillingStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumCardBillingStatusFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountCardId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class CardBillingSumAggregateInput {
  @Field(() => Boolean, { nullable: true })
  totalAmount?: true;
  @Field(() => Boolean, { nullable: true })
  paidAmount?: true;
  @Field(() => Boolean, { nullable: true })
  minimumPayment?: true;
}

@ObjectType()
export class CardBillingSumAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  minimumPayment?: Decimal;
}

@InputType()
export class CardBillingSumOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  totalAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paidAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  minimumPayment?: keyof typeof SortOrder;
}

@InputType()
export class CardBillingUncheckedCreateNestedManyWithoutAccountCardInput {
  @Field(() => [CardBillingCreateWithoutAccountCardInput], { nullable: true })
  @Type(() => CardBillingCreateWithoutAccountCardInput)
  create?: Array<CardBillingCreateWithoutAccountCardInput>;
  @Field(() => [CardBillingCreateOrConnectWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingCreateOrConnectWithoutAccountCardInput)
  connectOrCreate?: Array<CardBillingCreateOrConnectWithoutAccountCardInput>;
  @Field(() => CardBillingCreateManyAccountCardInputEnvelope, {
    nullable: true,
  })
  @Type(() => CardBillingCreateManyAccountCardInputEnvelope)
  createMany?: InstanceType<
    typeof CardBillingCreateManyAccountCardInputEnvelope
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  connect?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
}

@InputType()
export class CardBillingUncheckedCreateWithoutAccountCardInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutCardBillingInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutCardBillingInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutCardBillingInput
  >;
}

@InputType()
export class CardBillingUncheckedCreateWithoutTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: false })
  accountCardId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class CardBillingUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date | string;
  @Field(() => Date, { nullable: true })
  periodEnd?: Date | string;
  @Field(() => Date, { nullable: true })
  dueDate?: Date | string;
  @Field(() => Date, { nullable: true })
  closingDate?: Date | string;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  totalAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  paidAmount?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  minimumPayment?: Decimal;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: false })
  accountCardId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutCardBillingInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutCardBillingInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutCardBillingInput
  >;
}

@InputType()
export class CardBillingUncheckedUpdateManyWithoutAccountCardNestedInput {
  @Field(() => [CardBillingCreateWithoutAccountCardInput], { nullable: true })
  @Type(() => CardBillingCreateWithoutAccountCardInput)
  create?: Array<CardBillingCreateWithoutAccountCardInput>;
  @Field(() => [CardBillingCreateOrConnectWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingCreateOrConnectWithoutAccountCardInput)
  connectOrCreate?: Array<CardBillingCreateOrConnectWithoutAccountCardInput>;
  @Field(() => [CardBillingUpsertWithWhereUniqueWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingUpsertWithWhereUniqueWithoutAccountCardInput)
  upsert?: Array<CardBillingUpsertWithWhereUniqueWithoutAccountCardInput>;
  @Field(() => CardBillingCreateManyAccountCardInputEnvelope, {
    nullable: true,
  })
  @Type(() => CardBillingCreateManyAccountCardInputEnvelope)
  createMany?: InstanceType<
    typeof CardBillingCreateManyAccountCardInputEnvelope
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  set?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  disconnect?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  delete?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  connect?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingUpdateWithWhereUniqueWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingUpdateWithWhereUniqueWithoutAccountCardInput)
  update?: Array<CardBillingUpdateWithWhereUniqueWithoutAccountCardInput>;
  @Field(() => [CardBillingUpdateManyWithWhereWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingUpdateManyWithWhereWithoutAccountCardInput)
  updateMany?: Array<CardBillingUpdateManyWithWhereWithoutAccountCardInput>;
  @Field(() => [CardBillingScalarWhereInput], { nullable: true })
  @Type(() => CardBillingScalarWhereInput)
  deleteMany?: Array<CardBillingScalarWhereInput>;
}

@InputType()
export class CardBillingUncheckedUpdateManyWithoutAccountCardInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class CardBillingUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountCardId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class CardBillingUncheckedUpdateWithoutAccountCardInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => TransactionUncheckedUpdateManyWithoutCardBillingNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutCardBillingNestedInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutCardBillingNestedInput
  >;
}

@InputType()
export class CardBillingUncheckedUpdateWithoutTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountCardId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class CardBillingUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountCardId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => TransactionUncheckedUpdateManyWithoutCardBillingNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutCardBillingNestedInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutCardBillingNestedInput
  >;
}

@InputType()
export class CardBillingUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class CardBillingUpdateManyWithWhereWithoutAccountCardInput {
  @Field(() => CardBillingScalarWhereInput, { nullable: false })
  @Type(() => CardBillingScalarWhereInput)
  where!: InstanceType<typeof CardBillingScalarWhereInput>;
  @Field(() => CardBillingUpdateManyMutationInput, { nullable: false })
  @Type(() => CardBillingUpdateManyMutationInput)
  data!: InstanceType<typeof CardBillingUpdateManyMutationInput>;
}

@InputType()
export class CardBillingUpdateManyWithoutAccountCardNestedInput {
  @Field(() => [CardBillingCreateWithoutAccountCardInput], { nullable: true })
  @Type(() => CardBillingCreateWithoutAccountCardInput)
  create?: Array<CardBillingCreateWithoutAccountCardInput>;
  @Field(() => [CardBillingCreateOrConnectWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingCreateOrConnectWithoutAccountCardInput)
  connectOrCreate?: Array<CardBillingCreateOrConnectWithoutAccountCardInput>;
  @Field(() => [CardBillingUpsertWithWhereUniqueWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingUpsertWithWhereUniqueWithoutAccountCardInput)
  upsert?: Array<CardBillingUpsertWithWhereUniqueWithoutAccountCardInput>;
  @Field(() => CardBillingCreateManyAccountCardInputEnvelope, {
    nullable: true,
  })
  @Type(() => CardBillingCreateManyAccountCardInputEnvelope)
  createMany?: InstanceType<
    typeof CardBillingCreateManyAccountCardInputEnvelope
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  set?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  disconnect?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  delete?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingWhereUniqueInput], { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  connect?: Array<
    Prisma.AtLeast<
      CardBillingWhereUniqueInput,
      'id' | 'accountCardId_periodStart'
    >
  >;
  @Field(() => [CardBillingUpdateWithWhereUniqueWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingUpdateWithWhereUniqueWithoutAccountCardInput)
  update?: Array<CardBillingUpdateWithWhereUniqueWithoutAccountCardInput>;
  @Field(() => [CardBillingUpdateManyWithWhereWithoutAccountCardInput], {
    nullable: true,
  })
  @Type(() => CardBillingUpdateManyWithWhereWithoutAccountCardInput)
  updateMany?: Array<CardBillingUpdateManyWithWhereWithoutAccountCardInput>;
  @Field(() => [CardBillingScalarWhereInput], { nullable: true })
  @Type(() => CardBillingScalarWhereInput)
  deleteMany?: Array<CardBillingScalarWhereInput>;
}

@InputType()
export class CardBillingUpdateOneWithoutTransactionsNestedInput {
  @Field(() => CardBillingCreateWithoutTransactionsInput, { nullable: true })
  @Type(() => CardBillingCreateWithoutTransactionsInput)
  create?: InstanceType<typeof CardBillingCreateWithoutTransactionsInput>;
  @Field(() => CardBillingCreateOrConnectWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateOrConnectWithoutTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof CardBillingCreateOrConnectWithoutTransactionsInput
  >;
  @Field(() => CardBillingUpsertWithoutTransactionsInput, { nullable: true })
  @Type(() => CardBillingUpsertWithoutTransactionsInput)
  upsert?: InstanceType<typeof CardBillingUpsertWithoutTransactionsInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  disconnect?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  delete?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => CardBillingWhereUniqueInput, { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  connect?: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => CardBillingUpdateToOneWithWhereWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateToOneWithWhereWithoutTransactionsInput)
  update?: InstanceType<
    typeof CardBillingUpdateToOneWithWhereWithoutTransactionsInput
  >;
}

@InputType()
export class CardBillingUpdateToOneWithWhereWithoutTransactionsInput {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => CardBillingUpdateWithoutTransactionsInput, { nullable: false })
  @Type(() => CardBillingUpdateWithoutTransactionsInput)
  data!: InstanceType<typeof CardBillingUpdateWithoutTransactionsInput>;
}

@InputType()
export class CardBillingUpdateWithWhereUniqueWithoutAccountCardInput {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => CardBillingUpdateWithoutAccountCardInput, { nullable: false })
  @Type(() => CardBillingUpdateWithoutAccountCardInput)
  data!: InstanceType<typeof CardBillingUpdateWithoutAccountCardInput>;
}

@InputType()
export class CardBillingUpdateWithoutAccountCardInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => TransactionUpdateManyWithoutCardBillingNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutCardBillingNestedInput)
  transactions?: InstanceType<
    typeof TransactionUpdateManyWithoutCardBillingNestedInput
  >;
}

@InputType()
export class CardBillingUpdateWithoutTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUpdateOneRequiredWithoutBillingsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneRequiredWithoutBillingsNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneRequiredWithoutBillingsNestedInput
  >;
}

@InputType()
export class CardBillingUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  periodEnd?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  dueDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  closingDate?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  totalAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  paidAmount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  minimumPayment?: InstanceType<
    typeof NullableDecimalFieldUpdateOperationsInput
  >;
  @Field(() => EnumCardBillingStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumCardBillingStatusFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountCardUpdateOneRequiredWithoutBillingsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountCardUpdateOneRequiredWithoutBillingsNestedInput)
  accountCard?: InstanceType<
    typeof AccountCardUpdateOneRequiredWithoutBillingsNestedInput
  >;
  @Field(() => TransactionUpdateManyWithoutCardBillingNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithoutCardBillingNestedInput)
  transactions?: InstanceType<
    typeof TransactionUpdateManyWithoutCardBillingNestedInput
  >;
}

@InputType()
export class CardBillingUpsertWithWhereUniqueWithoutAccountCardInput {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => CardBillingUpdateWithoutAccountCardInput, { nullable: false })
  @Type(() => CardBillingUpdateWithoutAccountCardInput)
  update!: InstanceType<typeof CardBillingUpdateWithoutAccountCardInput>;
  @Field(() => CardBillingCreateWithoutAccountCardInput, { nullable: false })
  @Type(() => CardBillingCreateWithoutAccountCardInput)
  create!: InstanceType<typeof CardBillingCreateWithoutAccountCardInput>;
}

@InputType()
export class CardBillingUpsertWithoutTransactionsInput {
  @Field(() => CardBillingUpdateWithoutTransactionsInput, { nullable: false })
  @Type(() => CardBillingUpdateWithoutTransactionsInput)
  update!: InstanceType<typeof CardBillingUpdateWithoutTransactionsInput>;
  @Field(() => CardBillingCreateWithoutTransactionsInput, { nullable: false })
  @Type(() => CardBillingCreateWithoutTransactionsInput)
  create!: InstanceType<typeof CardBillingCreateWithoutTransactionsInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
}

@InputType()
export class CardBillingWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => CardBillingAccountCardIdPeriodStartCompoundUniqueInput, {
    nullable: true,
  })
  @Type(() => CardBillingAccountCardIdPeriodStartCompoundUniqueInput)
  accountCardId_periodStart?: InstanceType<
    typeof CardBillingAccountCardIdPeriodStartCompoundUniqueInput
  >;
  @Field(() => [CardBillingWhereInput], { nullable: true })
  @Type(() => CardBillingWhereInput)
  AND?: Array<CardBillingWhereInput>;
  @Field(() => [CardBillingWhereInput], { nullable: true })
  @Type(() => CardBillingWhereInput)
  OR?: Array<CardBillingWhereInput>;
  @Field(() => [CardBillingWhereInput], { nullable: true })
  @Type(() => CardBillingWhereInput)
  NOT?: Array<CardBillingWhereInput>;
  @Field(() => DateTimeFilter, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  periodEnd?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  dueDate?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  closingDate?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  totalAmount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  paidAmount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DecimalNullableFilter, { nullable: true })
  @Type(() => DecimalNullableFilter)
  minimumPayment?: InstanceType<typeof DecimalNullableFilter>;
  @Field(() => EnumCardBillingStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumCardBillingStatusFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountCardId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountCardRelationFilter, { nullable: true })
  @Type(() => AccountCardRelationFilter)
  accountCard?: InstanceType<typeof AccountCardRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  transactions?: InstanceType<typeof TransactionListRelationFilter>;
}

@InputType()
export class CardBillingWhereInput {
  @Field(() => [CardBillingWhereInput], { nullable: true })
  @Type(() => CardBillingWhereInput)
  AND?: Array<CardBillingWhereInput>;
  @Field(() => [CardBillingWhereInput], { nullable: true })
  @Type(() => CardBillingWhereInput)
  OR?: Array<CardBillingWhereInput>;
  @Field(() => [CardBillingWhereInput], { nullable: true })
  @Type(() => CardBillingWhereInput)
  NOT?: Array<CardBillingWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  periodStart?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  periodEnd?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  dueDate?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  closingDate?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  totalAmount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  paidAmount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DecimalNullableFilter, { nullable: true })
  @Type(() => DecimalNullableFilter)
  minimumPayment?: InstanceType<typeof DecimalNullableFilter>;
  @Field(() => EnumCardBillingStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumCardBillingStatusFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountCardId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountCardRelationFilter, { nullable: true })
  @Type(() => AccountCardRelationFilter)
  accountCard?: InstanceType<typeof AccountCardRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  transactions?: InstanceType<typeof TransactionListRelationFilter>;
}

@ObjectType()
export class CardBilling {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => Date, { nullable: false })
  periodStart!: Date;
  @Field(() => Date, { nullable: true })
  periodEnd!: Date | null;
  @Field(() => Date, { nullable: true })
  dueDate!: Date | null;
  @Field(() => Date, { nullable: true })
  closingDate!: Date | null;
  @Field(() => GraphQLDecimal, { nullable: false, defaultValue: 0 })
  totalAmount!: Decimal;
  @Field(() => GraphQLDecimal, { nullable: false, defaultValue: 0 })
  paidAmount!: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  minimumPayment!: Decimal | null;
  @Field(() => CardBillingStatus, { nullable: false })
  status!: keyof typeof CardBillingStatus;
  @Field(() => String, { nullable: false })
  accountCardId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => AccountCard, { nullable: false })
  accountCard?: InstanceType<typeof AccountCard>;
  @Field(() => [Transaction], { nullable: true })
  transactions?: Array<Transaction>;
  @Field(() => CardBillingCount, { nullable: false })
  _count?: InstanceType<typeof CardBillingCount>;
}

@ArgsType()
export class CreateManyCardBillingArgs {
  @Field(() => [CardBillingCreateManyInput], { nullable: false })
  @Type(() => CardBillingCreateManyInput)
  data!: Array<CardBillingCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneCardBillingArgs {
  @Field(() => CardBillingCreateInput, { nullable: false })
  @Type(() => CardBillingCreateInput)
  data!: InstanceType<typeof CardBillingCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyCardBillingArgs {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
}

@ArgsType()
export class DeleteOneCardBillingArgs {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstCardBillingOrThrowArgs {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => [CardBillingOrderByWithRelationInput], { nullable: true })
  @Type(() => CardBillingOrderByWithRelationInput)
  orderBy?: Array<CardBillingOrderByWithRelationInput>;
  @Field(() => CardBillingWhereUniqueInput, { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  cursor?: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [CardBillingScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof CardBillingScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstCardBillingArgs {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => [CardBillingOrderByWithRelationInput], { nullable: true })
  @Type(() => CardBillingOrderByWithRelationInput)
  orderBy?: Array<CardBillingOrderByWithRelationInput>;
  @Field(() => CardBillingWhereUniqueInput, { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  cursor?: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [CardBillingScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof CardBillingScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyCardBillingArgs {
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
  @Field(() => [CardBillingOrderByWithRelationInput], { nullable: true })
  @Type(() => CardBillingOrderByWithRelationInput)
  orderBy?: Array<CardBillingOrderByWithRelationInput>;
  @Field(() => CardBillingWhereUniqueInput, { nullable: true })
  @Type(() => CardBillingWhereUniqueInput)
  cursor?: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [CardBillingScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof CardBillingScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueCardBillingOrThrowArgs {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueCardBillingArgs {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpdateManyCardBillingArgs {
  @Field(() => CardBillingUpdateManyMutationInput, { nullable: false })
  @Type(() => CardBillingUpdateManyMutationInput)
  data!: InstanceType<typeof CardBillingUpdateManyMutationInput>;
  @Field(() => CardBillingWhereInput, { nullable: true })
  @Type(() => CardBillingWhereInput)
  where?: InstanceType<typeof CardBillingWhereInput>;
}

@ArgsType()
export class UpdateOneCardBillingArgs {
  @Field(() => CardBillingUpdateInput, { nullable: false })
  @Type(() => CardBillingUpdateInput)
  data!: InstanceType<typeof CardBillingUpdateInput>;
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneCardBillingArgs {
  @Field(() => CardBillingWhereUniqueInput, { nullable: false })
  @Type(() => CardBillingWhereUniqueInput)
  where!: Prisma.AtLeast<
    CardBillingWhereUniqueInput,
    'id' | 'accountCardId_periodStart'
  >;
  @Field(() => CardBillingCreateInput, { nullable: false })
  @Type(() => CardBillingCreateInput)
  create!: InstanceType<typeof CardBillingCreateInput>;
  @Field(() => CardBillingUpdateInput, { nullable: false })
  @Type(() => CardBillingUpdateInput)
  update!: InstanceType<typeof CardBillingUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ObjectType()
export class AggregateInstitution {
  @Field(() => InstitutionCountAggregate, { nullable: true })
  _count?: InstanceType<typeof InstitutionCountAggregate>;
  @Field(() => InstitutionMinAggregate, { nullable: true })
  _min?: InstanceType<typeof InstitutionMinAggregate>;
  @Field(() => InstitutionMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof InstitutionMaxAggregate>;
}

@ArgsType()
export class CreateManyInstitutionArgs {
  @Field(() => [InstitutionCreateManyInput], { nullable: false })
  @Type(() => InstitutionCreateManyInput)
  data!: Array<InstitutionCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneInstitutionArgs {
  @Field(() => InstitutionCreateInput, { nullable: false })
  @Type(() => InstitutionCreateInput)
  data!: InstanceType<typeof InstitutionCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyInstitutionArgs {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
}

@ArgsType()
export class DeleteOneInstitutionArgs {
  @Field(() => InstitutionWhereUniqueInput, { nullable: false })
  @Type(() => InstitutionWhereUniqueInput)
  where!: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstInstitutionOrThrowArgs {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => [InstitutionOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InstitutionOrderByWithRelationInput>;
  @Field(() => InstitutionWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InstitutionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InstitutionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstInstitutionArgs {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => [InstitutionOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InstitutionOrderByWithRelationInput>;
  @Field(() => InstitutionWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InstitutionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InstitutionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyInstitutionArgs {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => [InstitutionOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InstitutionOrderByWithRelationInput>;
  @Field(() => InstitutionWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InstitutionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InstitutionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueInstitutionOrThrowArgs {
  @Field(() => InstitutionWhereUniqueInput, { nullable: false })
  @Type(() => InstitutionWhereUniqueInput)
  where!: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueInstitutionArgs {
  @Field(() => InstitutionWhereUniqueInput, { nullable: false })
  @Type(() => InstitutionWhereUniqueInput)
  where!: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class InstitutionAggregateArgs {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => [InstitutionOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InstitutionOrderByWithRelationInput>;
  @Field(() => InstitutionWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => InstitutionCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof InstitutionCountAggregateInput>;
  @Field(() => InstitutionMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof InstitutionMinAggregateInput>;
  @Field(() => InstitutionMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof InstitutionMaxAggregateInput>;
}

@InputType()
export class InstitutionCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  code?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  logoUrl?: true;
  @Field(() => Boolean, { nullable: true })
  color?: true;
  @Field(() => Boolean, { nullable: true })
  types?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class InstitutionCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  code!: number;
  @Field(() => Int, { nullable: false })
  name!: number;
  @Field(() => Int, { nullable: false })
  logoUrl!: number;
  @Field(() => Int, { nullable: false })
  color!: number;
  @Field(() => Int, { nullable: false })
  types!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class InstitutionCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  code?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  logoUrl?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  color?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  types?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@ObjectType()
export class InstitutionCount {
  @Field(() => Int, { nullable: false })
  accounts?: number;
}

@InputType()
export class InstitutionCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => InstitutionCreatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionCreatetypesInput>;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InstitutionCreateNestedOneWithoutAccountsInput {
  @Field(() => InstitutionCreateWithoutAccountsInput, { nullable: true })
  @Type(() => InstitutionCreateWithoutAccountsInput)
  create?: InstanceType<typeof InstitutionCreateWithoutAccountsInput>;
  @Field(() => InstitutionCreateOrConnectWithoutAccountsInput, {
    nullable: true,
  })
  @Type(() => InstitutionCreateOrConnectWithoutAccountsInput)
  connectOrCreate?: InstanceType<
    typeof InstitutionCreateOrConnectWithoutAccountsInput
  >;
  @Field(() => InstitutionWhereUniqueInput, { nullable: true })
  @Type(() => InstitutionWhereUniqueInput)
  connect?: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
}

@InputType()
export class InstitutionCreateOrConnectWithoutAccountsInput {
  @Field(() => InstitutionWhereUniqueInput, { nullable: false })
  @Type(() => InstitutionWhereUniqueInput)
  where!: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => InstitutionCreateWithoutAccountsInput, { nullable: false })
  @Type(() => InstitutionCreateWithoutAccountsInput)
  create!: InstanceType<typeof InstitutionCreateWithoutAccountsInput>;
}

@InputType()
export class InstitutionCreateWithoutAccountsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => InstitutionCreatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionCreatetypesInput>;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InstitutionCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => InstitutionCreatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionCreatetypesInput>;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedManyWithoutInstitutionInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedManyWithoutInstitutionInput)
  accounts?: InstanceType<
    typeof AccountCreateNestedManyWithoutInstitutionInput
  >;
}

@InputType()
export class InstitutionCreatetypesInput {
  @Field(() => [AccountType], { nullable: false })
  set!: Array<keyof typeof AccountType>;
}

@ArgsType()
export class InstitutionGroupByArgs {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => [InstitutionOrderByWithAggregationInput], { nullable: true })
  orderBy?: Array<InstitutionOrderByWithAggregationInput>;
  @Field(() => [InstitutionScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof InstitutionScalarFieldEnum>;
  @Field(() => InstitutionScalarWhereWithAggregatesInput, { nullable: true })
  having?: InstanceType<typeof InstitutionScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => InstitutionCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof InstitutionCountAggregateInput>;
  @Field(() => InstitutionMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof InstitutionMinAggregateInput>;
  @Field(() => InstitutionMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof InstitutionMaxAggregateInput>;
}

@ObjectType()
export class InstitutionGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => [AccountType], { nullable: true })
  types?: Array<keyof typeof AccountType>;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => InstitutionCountAggregate, { nullable: true })
  _count?: InstanceType<typeof InstitutionCountAggregate>;
  @Field(() => InstitutionMinAggregate, { nullable: true })
  _min?: InstanceType<typeof InstitutionMinAggregate>;
  @Field(() => InstitutionMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof InstitutionMaxAggregate>;
}

@InputType()
export class InstitutionMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  code?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  logoUrl?: true;
  @Field(() => Boolean, { nullable: true })
  color?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class InstitutionMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  code?: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InstitutionMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  code?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  logoUrl?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  color?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InstitutionMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  code?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  logoUrl?: true;
  @Field(() => Boolean, { nullable: true })
  color?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class InstitutionMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  code?: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InstitutionMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  code?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  logoUrl?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  color?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InstitutionOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  code?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  logoUrl?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  color?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  types?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => InstitutionCountOrderByAggregateInput, { nullable: true })
  _count?: InstanceType<typeof InstitutionCountOrderByAggregateInput>;
  @Field(() => InstitutionMaxOrderByAggregateInput, { nullable: true })
  _max?: InstanceType<typeof InstitutionMaxOrderByAggregateInput>;
  @Field(() => InstitutionMinOrderByAggregateInput, { nullable: true })
  _min?: InstanceType<typeof InstitutionMinOrderByAggregateInput>;
}

@InputType()
export class InstitutionOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  code?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  logoUrl?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  color?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  types?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountOrderByRelationAggregateInput, { nullable: true })
  @Type(() => AccountOrderByRelationAggregateInput)
  accounts?: InstanceType<typeof AccountOrderByRelationAggregateInput>;
}

@InputType()
export class InstitutionRelationFilter {
  @Field(() => InstitutionWhereInput, { nullable: true })
  is?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => InstitutionWhereInput, { nullable: true })
  isNot?: InstanceType<typeof InstitutionWhereInput>;
}

@InputType()
export class InstitutionScalarWhereWithAggregatesInput {
  @Field(() => [InstitutionScalarWhereWithAggregatesInput], { nullable: true })
  AND?: Array<InstitutionScalarWhereWithAggregatesInput>;
  @Field(() => [InstitutionScalarWhereWithAggregatesInput], { nullable: true })
  OR?: Array<InstitutionScalarWhereWithAggregatesInput>;
  @Field(() => [InstitutionScalarWhereWithAggregatesInput], { nullable: true })
  NOT?: Array<InstitutionScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  code?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  name?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  logoUrl?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  color?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => EnumAccountTypeNullableListFilter, { nullable: true })
  types?: InstanceType<typeof EnumAccountTypeNullableListFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class InstitutionUncheckedCreateWithoutAccountsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => InstitutionCreatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionCreatetypesInput>;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InstitutionUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl?: string;
  @Field(() => String, { nullable: true })
  color?: string;
  @Field(() => InstitutionCreatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionCreatetypesInput>;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountUncheckedCreateNestedManyWithoutInstitutionInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedCreateNestedManyWithoutInstitutionInput)
  accounts?: InstanceType<
    typeof AccountUncheckedCreateNestedManyWithoutInstitutionInput
  >;
}

@InputType()
export class InstitutionUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  code?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  logoUrl?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  color?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionUpdatetypesInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InstitutionUncheckedUpdateWithoutAccountsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  code?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  logoUrl?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  color?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionUpdatetypesInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InstitutionUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  code?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  logoUrl?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  color?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionUpdatetypesInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUncheckedUpdateManyWithoutInstitutionNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedUpdateManyWithoutInstitutionNestedInput)
  accounts?: InstanceType<
    typeof AccountUncheckedUpdateManyWithoutInstitutionNestedInput
  >;
}

@InputType()
export class InstitutionUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  code?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  logoUrl?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  color?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionUpdatetypesInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InstitutionUpdateOneRequiredWithoutAccountsNestedInput {
  @Field(() => InstitutionCreateWithoutAccountsInput, { nullable: true })
  @Type(() => InstitutionCreateWithoutAccountsInput)
  create?: InstanceType<typeof InstitutionCreateWithoutAccountsInput>;
  @Field(() => InstitutionCreateOrConnectWithoutAccountsInput, {
    nullable: true,
  })
  @Type(() => InstitutionCreateOrConnectWithoutAccountsInput)
  connectOrCreate?: InstanceType<
    typeof InstitutionCreateOrConnectWithoutAccountsInput
  >;
  @Field(() => InstitutionUpsertWithoutAccountsInput, { nullable: true })
  @Type(() => InstitutionUpsertWithoutAccountsInput)
  upsert?: InstanceType<typeof InstitutionUpsertWithoutAccountsInput>;
  @Field(() => InstitutionWhereUniqueInput, { nullable: true })
  @Type(() => InstitutionWhereUniqueInput)
  connect?: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => InstitutionUpdateToOneWithWhereWithoutAccountsInput, {
    nullable: true,
  })
  @Type(() => InstitutionUpdateToOneWithWhereWithoutAccountsInput)
  update?: InstanceType<
    typeof InstitutionUpdateToOneWithWhereWithoutAccountsInput
  >;
}

@InputType()
export class InstitutionUpdateToOneWithWhereWithoutAccountsInput {
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
  @Field(() => InstitutionUpdateWithoutAccountsInput, { nullable: false })
  @Type(() => InstitutionUpdateWithoutAccountsInput)
  data!: InstanceType<typeof InstitutionUpdateWithoutAccountsInput>;
}

@InputType()
export class InstitutionUpdateWithoutAccountsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  code?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  logoUrl?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  color?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionUpdatetypesInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InstitutionUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  code?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  logoUrl?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  color?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => InstitutionUpdatetypesInput, { nullable: true })
  types?: InstanceType<typeof InstitutionUpdatetypesInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateManyWithoutInstitutionNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateManyWithoutInstitutionNestedInput)
  accounts?: InstanceType<
    typeof AccountUpdateManyWithoutInstitutionNestedInput
  >;
}

@InputType()
export class InstitutionUpdatetypesInput {
  @Field(() => [AccountType], { nullable: true })
  set?: Array<keyof typeof AccountType>;
  @Field(() => [AccountType], { nullable: true })
  push?: Array<keyof typeof AccountType>;
}

@InputType()
export class InstitutionUpsertWithoutAccountsInput {
  @Field(() => InstitutionUpdateWithoutAccountsInput, { nullable: false })
  @Type(() => InstitutionUpdateWithoutAccountsInput)
  update!: InstanceType<typeof InstitutionUpdateWithoutAccountsInput>;
  @Field(() => InstitutionCreateWithoutAccountsInput, { nullable: false })
  @Type(() => InstitutionCreateWithoutAccountsInput)
  create!: InstanceType<typeof InstitutionCreateWithoutAccountsInput>;
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
}

@InputType()
export class InstitutionWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => [InstitutionWhereInput], { nullable: true })
  AND?: Array<InstitutionWhereInput>;
  @Field(() => [InstitutionWhereInput], { nullable: true })
  OR?: Array<InstitutionWhereInput>;
  @Field(() => [InstitutionWhereInput], { nullable: true })
  NOT?: Array<InstitutionWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  code?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  logoUrl?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  color?: InstanceType<typeof StringNullableFilter>;
  @Field(() => EnumAccountTypeNullableListFilter, { nullable: true })
  types?: InstanceType<typeof EnumAccountTypeNullableListFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountListRelationFilter, { nullable: true })
  @Type(() => AccountListRelationFilter)
  accounts?: InstanceType<typeof AccountListRelationFilter>;
}

@InputType()
export class InstitutionWhereInput {
  @Field(() => [InstitutionWhereInput], { nullable: true })
  AND?: Array<InstitutionWhereInput>;
  @Field(() => [InstitutionWhereInput], { nullable: true })
  OR?: Array<InstitutionWhereInput>;
  @Field(() => [InstitutionWhereInput], { nullable: true })
  NOT?: Array<InstitutionWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  code?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  logoUrl?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  color?: InstanceType<typeof StringNullableFilter>;
  @Field(() => EnumAccountTypeNullableListFilter, { nullable: true })
  types?: InstanceType<typeof EnumAccountTypeNullableListFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountListRelationFilter, { nullable: true })
  @Type(() => AccountListRelationFilter)
  accounts?: InstanceType<typeof AccountListRelationFilter>;
}

@ObjectType()
export class Institution {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  code!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => String, { nullable: true })
  logoUrl!: string | null;
  @Field(() => String, { nullable: true })
  color!: string | null;
  @Field(() => [AccountType], { nullable: true })
  types!: Array<keyof typeof AccountType>;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => [Account], { nullable: true })
  accounts?: Array<Account>;
  @Field(() => InstitutionCount, { nullable: false })
  _count?: InstanceType<typeof InstitutionCount>;
}

@ArgsType()
export class UpdateManyInstitutionArgs {
  @Field(() => InstitutionUpdateManyMutationInput, { nullable: false })
  @Type(() => InstitutionUpdateManyMutationInput)
  data!: InstanceType<typeof InstitutionUpdateManyMutationInput>;
  @Field(() => InstitutionWhereInput, { nullable: true })
  @Type(() => InstitutionWhereInput)
  where?: InstanceType<typeof InstitutionWhereInput>;
}

@ArgsType()
export class UpdateOneInstitutionArgs {
  @Field(() => InstitutionUpdateInput, { nullable: false })
  @Type(() => InstitutionUpdateInput)
  data!: InstanceType<typeof InstitutionUpdateInput>;
  @Field(() => InstitutionWhereUniqueInput, { nullable: false })
  @Type(() => InstitutionWhereUniqueInput)
  where!: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneInstitutionArgs {
  @Field(() => InstitutionWhereUniqueInput, { nullable: false })
  @Type(() => InstitutionWhereUniqueInput)
  where!: Prisma.AtLeast<InstitutionWhereUniqueInput, 'id'>;
  @Field(() => InstitutionCreateInput, { nullable: false })
  @Type(() => InstitutionCreateInput)
  create!: InstanceType<typeof InstitutionCreateInput>;
  @Field(() => InstitutionUpdateInput, { nullable: false })
  @Type(() => InstitutionUpdateInput)
  update!: InstanceType<typeof InstitutionUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ObjectType()
export class AggregateInvestment {
  @Field(() => InvestmentCountAggregate, { nullable: true })
  _count?: InstanceType<typeof InvestmentCountAggregate>;
  @Field(() => InvestmentAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof InvestmentAvgAggregate>;
  @Field(() => InvestmentSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof InvestmentSumAggregate>;
  @Field(() => InvestmentMinAggregate, { nullable: true })
  _min?: InstanceType<typeof InvestmentMinAggregate>;
  @Field(() => InvestmentMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof InvestmentMaxAggregate>;
}

@ArgsType()
export class CreateManyInvestmentArgs {
  @Field(() => [InvestmentCreateManyInput], { nullable: false })
  @Type(() => InvestmentCreateManyInput)
  data!: Array<InvestmentCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneInvestmentArgs {
  @Field(() => InvestmentCreateInput, { nullable: false })
  @Type(() => InvestmentCreateInput)
  data!: InstanceType<typeof InvestmentCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyInvestmentArgs {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
}

@ArgsType()
export class DeleteOneInvestmentArgs {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstInvestmentOrThrowArgs {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => [InvestmentOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InvestmentOrderByWithRelationInput>;
  @Field(() => InvestmentWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InvestmentScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InvestmentScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstInvestmentArgs {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => [InvestmentOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InvestmentOrderByWithRelationInput>;
  @Field(() => InvestmentWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InvestmentScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InvestmentScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyInvestmentArgs {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => [InvestmentOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InvestmentOrderByWithRelationInput>;
  @Field(() => InvestmentWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InvestmentScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InvestmentScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueInvestmentOrThrowArgs {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueInvestmentArgs {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class InvestmentAggregateArgs {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => [InvestmentOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<InvestmentOrderByWithRelationInput>;
  @Field(() => InvestmentWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => InvestmentCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof InvestmentCountAggregateInput>;
  @Field(() => InvestmentAvgAggregateInput, { nullable: true })
  _avg?: InstanceType<typeof InvestmentAvgAggregateInput>;
  @Field(() => InvestmentSumAggregateInput, { nullable: true })
  _sum?: InstanceType<typeof InvestmentSumAggregateInput>;
  @Field(() => InvestmentMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof InvestmentMinAggregateInput>;
  @Field(() => InvestmentMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof InvestmentMaxAggregateInput>;
}

@InputType()
export class InvestmentAvgAggregateInput {
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  correctedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  taxedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
}

@ObjectType()
export class InvestmentAvgAggregate {
  @Field(() => Float, { nullable: true })
  amount?: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Float, { nullable: true })
  duration?: number;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
}

@InputType()
export class InvestmentAvgOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  correctedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  taxedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  correctedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  taxedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  startDate?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  finishedAt?: true;
  @Field(() => Boolean, { nullable: true })
  lastCorrectedAt?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  regimeName?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class InvestmentCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  amount!: number;
  @Field(() => Int, { nullable: false })
  correctedAmount!: number;
  @Field(() => Int, { nullable: false })
  taxedAmount!: number;
  @Field(() => Int, { nullable: false })
  startDate!: number;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Int, { nullable: false })
  finishedAt!: number;
  @Field(() => Int, { nullable: false })
  lastCorrectedAt!: number;
  @Field(() => Int, { nullable: false })
  status!: number;
  @Field(() => Int, { nullable: false })
  regimeName!: number;
  @Field(() => Int, { nullable: false })
  regimePercentage!: number;
  @Field(() => Int, { nullable: false })
  userId!: number;
  @Field(() => Int, { nullable: false })
  accountId!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class InvestmentCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  correctedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  taxedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  finishedAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  lastCorrectedAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@ObjectType()
export class InvestmentCount {
  @Field(() => Int, { nullable: false })
  transactions?: number;
}

@InputType()
export class InvestmentCreateManyAccountInputEnvelope {
  @Field(() => [InvestmentCreateManyAccountInput], { nullable: false })
  @Type(() => InvestmentCreateManyAccountInput)
  data!: Array<InvestmentCreateManyAccountInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class InvestmentCreateManyAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentCreateManyUserInputEnvelope {
  @Field(() => [InvestmentCreateManyUserInput], { nullable: false })
  @Type(() => InvestmentCreateManyUserInput)
  data!: Array<InvestmentCreateManyUserInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class InvestmentCreateManyUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentCreateNestedManyWithoutAccountInput {
  @Field(() => [InvestmentCreateWithoutAccountInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutAccountInput)
  create?: Array<InvestmentCreateWithoutAccountInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutAccountInput>;
  @Field(() => InvestmentCreateManyAccountInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyAccountInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyAccountInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentCreateNestedManyWithoutUserInput {
  @Field(() => [InvestmentCreateWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutUserInput)
  create?: Array<InvestmentCreateWithoutUserInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutUserInput>;
  @Field(() => InvestmentCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyUserInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentCreateNestedOneWithoutTransactionsInput {
  @Field(() => InvestmentCreateWithoutTransactionsInput, { nullable: true })
  @Type(() => InvestmentCreateWithoutTransactionsInput)
  create?: InstanceType<typeof InvestmentCreateWithoutTransactionsInput>;
  @Field(() => InvestmentCreateOrConnectWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateOrConnectWithoutTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof InvestmentCreateOrConnectWithoutTransactionsInput
  >;
  @Field(() => InvestmentWhereUniqueInput, { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
}

@InputType()
export class InvestmentCreateOrConnectWithoutAccountInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentCreateWithoutAccountInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutAccountInput)
  create!: InstanceType<typeof InvestmentCreateWithoutAccountInput>;
}

@InputType()
export class InvestmentCreateOrConnectWithoutTransactionsInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentCreateWithoutTransactionsInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutTransactionsInput)
  create!: InstanceType<typeof InvestmentCreateWithoutTransactionsInput>;
}

@InputType()
export class InvestmentCreateOrConnectWithoutUserInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentCreateWithoutUserInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutUserInput)
  create!: InstanceType<typeof InvestmentCreateWithoutUserInput>;
}

@InputType()
export class InvestmentCreateWithoutAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutInvestmentsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutInvestmentsInput>;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutInvestmentInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutInvestmentInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentCreateWithoutTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutInvestmentsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutInvestmentsInput>;
  @Field(() => AccountCreateNestedOneWithoutInvestmentsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutInvestmentsInput)
  account!: InstanceType<typeof AccountCreateNestedOneWithoutInvestmentsInput>;
}

@InputType()
export class InvestmentCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutInvestmentsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutInvestmentsInput)
  account!: InstanceType<typeof AccountCreateNestedOneWithoutInvestmentsInput>;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutInvestmentInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutInvestmentInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutInvestmentsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutInvestmentsInput>;
  @Field(() => AccountCreateNestedOneWithoutInvestmentsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutInvestmentsInput)
  account!: InstanceType<typeof AccountCreateNestedOneWithoutInvestmentsInput>;
  @Field(() => InvestmentTransactionCreateNestedManyWithoutInvestmentInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateNestedManyWithoutInvestmentInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionCreateNestedManyWithoutInvestmentInput
  >;
}

@ArgsType()
export class InvestmentGroupByArgs {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => [InvestmentOrderByWithAggregationInput], { nullable: true })
  orderBy?: Array<InvestmentOrderByWithAggregationInput>;
  @Field(() => [InvestmentScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof InvestmentScalarFieldEnum>;
  @Field(() => InvestmentScalarWhereWithAggregatesInput, { nullable: true })
  having?: InstanceType<typeof InvestmentScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => InvestmentCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof InvestmentCountAggregateInput>;
  @Field(() => InvestmentAvgAggregateInput, { nullable: true })
  _avg?: InstanceType<typeof InvestmentAvgAggregateInput>;
  @Field(() => InvestmentSumAggregateInput, { nullable: true })
  _sum?: InstanceType<typeof InvestmentSumAggregateInput>;
  @Field(() => InvestmentMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof InvestmentMinAggregateInput>;
  @Field(() => InvestmentMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof InvestmentMaxAggregateInput>;
}

@ObjectType()
export class InvestmentGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: false })
  status!: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => InvestmentCountAggregate, { nullable: true })
  _count?: InstanceType<typeof InvestmentCountAggregate>;
  @Field(() => InvestmentAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof InvestmentAvgAggregate>;
  @Field(() => InvestmentSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof InvestmentSumAggregate>;
  @Field(() => InvestmentMinAggregate, { nullable: true })
  _min?: InstanceType<typeof InvestmentMinAggregate>;
  @Field(() => InvestmentMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof InvestmentMaxAggregate>;
}

@InputType()
export class InvestmentListRelationFilter {
  @Field(() => InvestmentWhereInput, { nullable: true })
  every?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => InvestmentWhereInput, { nullable: true })
  some?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => InvestmentWhereInput, { nullable: true })
  none?: InstanceType<typeof InvestmentWhereInput>;
}

@InputType()
export class InvestmentMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  correctedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  taxedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  startDate?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  finishedAt?: true;
  @Field(() => Boolean, { nullable: true })
  lastCorrectedAt?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  regimeName?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class InvestmentMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: true })
  amount?: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: true })
  startDate?: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: true })
  regimeName?: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: true })
  userId?: string;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  correctedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  taxedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  finishedAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  lastCorrectedAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  correctedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  taxedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  startDate?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  finishedAt?: true;
  @Field(() => Boolean, { nullable: true })
  lastCorrectedAt?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  regimeName?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class InvestmentMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: true })
  amount?: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: true })
  startDate?: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: true })
  regimeName?: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: true })
  userId?: string;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  correctedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  taxedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  finishedAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  lastCorrectedAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentOrderByRelationAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  _count?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  correctedAmount?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  taxedAmount?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  duration?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  finishedAt?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  lastCorrectedAt?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  regimePercentage?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => InvestmentCountOrderByAggregateInput, { nullable: true })
  _count?: InstanceType<typeof InvestmentCountOrderByAggregateInput>;
  @Field(() => InvestmentAvgOrderByAggregateInput, { nullable: true })
  _avg?: InstanceType<typeof InvestmentAvgOrderByAggregateInput>;
  @Field(() => InvestmentMaxOrderByAggregateInput, { nullable: true })
  _max?: InstanceType<typeof InvestmentMaxOrderByAggregateInput>;
  @Field(() => InvestmentMinOrderByAggregateInput, { nullable: true })
  _min?: InstanceType<typeof InvestmentMinOrderByAggregateInput>;
  @Field(() => InvestmentSumOrderByAggregateInput, { nullable: true })
  _sum?: InstanceType<typeof InvestmentSumOrderByAggregateInput>;
}

@InputType()
export class InvestmentOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  correctedAmount?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  taxedAmount?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  duration?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  finishedAt?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  lastCorrectedAt?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  regimePercentage?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => UserOrderByWithRelationInput, { nullable: true })
  @Type(() => UserOrderByWithRelationInput)
  user?: InstanceType<typeof UserOrderByWithRelationInput>;
  @Field(() => AccountOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  account?: InstanceType<typeof AccountOrderByWithRelationInput>;
  @Field(() => InvestmentTransactionOrderByRelationAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByRelationAggregateInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionOrderByRelationAggregateInput
  >;
}

@InputType()
export class InvestmentRelationFilter {
  @Field(() => InvestmentWhereInput, { nullable: true })
  is?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => InvestmentWhereInput, { nullable: true })
  isNot?: InstanceType<typeof InvestmentWhereInput>;
}

@InputType()
export class InvestmentScalarWhereWithAggregatesInput {
  @Field(() => [InvestmentScalarWhereWithAggregatesInput], { nullable: true })
  AND?: Array<InvestmentScalarWhereWithAggregatesInput>;
  @Field(() => [InvestmentScalarWhereWithAggregatesInput], { nullable: true })
  OR?: Array<InvestmentScalarWhereWithAggregatesInput>;
  @Field(() => [InvestmentScalarWhereWithAggregatesInput], { nullable: true })
  NOT?: Array<InvestmentScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => FloatWithAggregatesFilter, { nullable: true })
  amount?: InstanceType<typeof FloatWithAggregatesFilter>;
  @Field(() => FloatNullableWithAggregatesFilter, { nullable: true })
  correctedAmount?: InstanceType<typeof FloatNullableWithAggregatesFilter>;
  @Field(() => FloatNullableWithAggregatesFilter, { nullable: true })
  taxedAmount?: InstanceType<typeof FloatNullableWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => IntNullableWithAggregatesFilter, { nullable: true })
  duration?: InstanceType<typeof IntNullableWithAggregatesFilter>;
  @Field(() => DateTimeNullableWithAggregatesFilter, { nullable: true })
  finishedAt?: InstanceType<typeof DateTimeNullableWithAggregatesFilter>;
  @Field(() => DateTimeNullableWithAggregatesFilter, { nullable: true })
  lastCorrectedAt?: InstanceType<typeof DateTimeNullableWithAggregatesFilter>;
  @Field(() => EnumInvestmentStatusWithAggregatesFilter, { nullable: true })
  status?: InstanceType<typeof EnumInvestmentStatusWithAggregatesFilter>;
  @Field(() => EnumRegimeWithAggregatesFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeWithAggregatesFilter>;
  @Field(() => FloatNullableWithAggregatesFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  userId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  accountId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class InvestmentScalarWhereInput {
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  AND?: Array<InvestmentScalarWhereInput>;
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  OR?: Array<InvestmentScalarWhereInput>;
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  NOT?: Array<InvestmentScalarWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => FloatFilter, { nullable: true })
  amount?: InstanceType<typeof FloatFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  correctedAmount?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  taxedAmount?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFilter>;
  @Field(() => IntNullableFilter, { nullable: true })
  duration?: InstanceType<typeof IntNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  finishedAt?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  lastCorrectedAt?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => EnumInvestmentStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumInvestmentStatusFilter>;
  @Field(() => EnumRegimeFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class InvestmentSumAggregateInput {
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  correctedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  taxedAmount?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
}

@ObjectType()
export class InvestmentSumAggregate {
  @Field(() => Float, { nullable: true })
  amount?: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
}

@InputType()
export class InvestmentSumOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  correctedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  taxedAmount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentUncheckedCreateNestedManyWithoutAccountInput {
  @Field(() => [InvestmentCreateWithoutAccountInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutAccountInput)
  create?: Array<InvestmentCreateWithoutAccountInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutAccountInput>;
  @Field(() => InvestmentCreateManyAccountInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyAccountInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyAccountInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentUncheckedCreateNestedManyWithoutUserInput {
  @Field(() => [InvestmentCreateWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutUserInput)
  create?: Array<InvestmentCreateWithoutUserInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutUserInput>;
  @Field(() => InvestmentCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyUserInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentUncheckedCreateWithoutAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput,
    { nullable: true },
  )
  @Type(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput,
  )
  transactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentUncheckedCreateWithoutTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentUncheckedCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput,
    { nullable: true },
  )
  @Type(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput,
  )
  transactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount?: number;
  @Field(() => Float, { nullable: true })
  taxedAmount?: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Date, { nullable: true })
  finishedAt?: Date | string;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt?: Date | string;
  @Field(() => InvestmentStatus, { nullable: true })
  status?: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput,
    { nullable: true },
  )
  @Type(
    () => InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput,
  )
  transactions?: InstanceType<
    typeof InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentUncheckedUpdateManyWithoutAccountNestedInput {
  @Field(() => [InvestmentCreateWithoutAccountInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutAccountInput)
  create?: Array<InvestmentCreateWithoutAccountInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutAccountInput>;
  @Field(() => [InvestmentUpsertWithWhereUniqueWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpsertWithWhereUniqueWithoutAccountInput)
  upsert?: Array<InvestmentUpsertWithWhereUniqueWithoutAccountInput>;
  @Field(() => InvestmentCreateManyAccountInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyAccountInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyAccountInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentUpdateWithWhereUniqueWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateWithWhereUniqueWithoutAccountInput)
  update?: Array<InvestmentUpdateWithWhereUniqueWithoutAccountInput>;
  @Field(() => [InvestmentUpdateManyWithWhereWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithWhereWithoutAccountInput)
  updateMany?: Array<InvestmentUpdateManyWithWhereWithoutAccountInput>;
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  @Type(() => InvestmentScalarWhereInput)
  deleteMany?: Array<InvestmentScalarWhereInput>;
}

@InputType()
export class InvestmentUncheckedUpdateManyWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentUncheckedUpdateManyWithoutUserNestedInput {
  @Field(() => [InvestmentCreateWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutUserInput)
  create?: Array<InvestmentCreateWithoutUserInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutUserInput>;
  @Field(() => [InvestmentUpsertWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpsertWithWhereUniqueWithoutUserInput)
  upsert?: Array<InvestmentUpsertWithWhereUniqueWithoutUserInput>;
  @Field(() => InvestmentCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyUserInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentUpdateWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateWithWhereUniqueWithoutUserInput)
  update?: Array<InvestmentUpdateWithWhereUniqueWithoutUserInput>;
  @Field(() => [InvestmentUpdateManyWithWhereWithoutUserInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithWhereWithoutUserInput)
  updateMany?: Array<InvestmentUpdateManyWithWhereWithoutUserInput>;
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  @Type(() => InvestmentScalarWhereInput)
  deleteMany?: Array<InvestmentScalarWhereInput>;
}

@InputType()
export class InvestmentUncheckedUpdateManyWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentUncheckedUpdateWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput,
    { nullable: true },
  )
  @Type(
    () => InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput,
  )
  transactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput
  >;
}

@InputType()
export class InvestmentUncheckedUpdateWithoutTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentUncheckedUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput,
    { nullable: true },
  )
  @Type(
    () => InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput,
  )
  transactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput
  >;
}

@InputType()
export class InvestmentUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(
    () => InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput,
    { nullable: true },
  )
  @Type(
    () => InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput,
  )
  transactions?: InstanceType<
    typeof InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput
  >;
}

@InputType()
export class InvestmentUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentUpdateManyWithWhereWithoutAccountInput {
  @Field(() => InvestmentScalarWhereInput, { nullable: false })
  @Type(() => InvestmentScalarWhereInput)
  where!: InstanceType<typeof InvestmentScalarWhereInput>;
  @Field(() => InvestmentUpdateManyMutationInput, { nullable: false })
  @Type(() => InvestmentUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentUpdateManyMutationInput>;
}

@InputType()
export class InvestmentUpdateManyWithWhereWithoutUserInput {
  @Field(() => InvestmentScalarWhereInput, { nullable: false })
  @Type(() => InvestmentScalarWhereInput)
  where!: InstanceType<typeof InvestmentScalarWhereInput>;
  @Field(() => InvestmentUpdateManyMutationInput, { nullable: false })
  @Type(() => InvestmentUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentUpdateManyMutationInput>;
}

@InputType()
export class InvestmentUpdateManyWithoutAccountNestedInput {
  @Field(() => [InvestmentCreateWithoutAccountInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutAccountInput)
  create?: Array<InvestmentCreateWithoutAccountInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutAccountInput>;
  @Field(() => [InvestmentUpsertWithWhereUniqueWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpsertWithWhereUniqueWithoutAccountInput)
  upsert?: Array<InvestmentUpsertWithWhereUniqueWithoutAccountInput>;
  @Field(() => InvestmentCreateManyAccountInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyAccountInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyAccountInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentUpdateWithWhereUniqueWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateWithWhereUniqueWithoutAccountInput)
  update?: Array<InvestmentUpdateWithWhereUniqueWithoutAccountInput>;
  @Field(() => [InvestmentUpdateManyWithWhereWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithWhereWithoutAccountInput)
  updateMany?: Array<InvestmentUpdateManyWithWhereWithoutAccountInput>;
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  @Type(() => InvestmentScalarWhereInput)
  deleteMany?: Array<InvestmentScalarWhereInput>;
}

@InputType()
export class InvestmentUpdateManyWithoutUserNestedInput {
  @Field(() => [InvestmentCreateWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateWithoutUserInput)
  create?: Array<InvestmentCreateWithoutUserInput>;
  @Field(() => [InvestmentCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => InvestmentCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<InvestmentCreateOrConnectWithoutUserInput>;
  @Field(() => [InvestmentUpsertWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpsertWithWhereUniqueWithoutUserInput)
  upsert?: Array<InvestmentUpsertWithWhereUniqueWithoutUserInput>;
  @Field(() => InvestmentCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => InvestmentCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof InvestmentCreateManyUserInputEnvelope>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentUpdateWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateWithWhereUniqueWithoutUserInput)
  update?: Array<InvestmentUpdateWithWhereUniqueWithoutUserInput>;
  @Field(() => [InvestmentUpdateManyWithWhereWithoutUserInput], {
    nullable: true,
  })
  @Type(() => InvestmentUpdateManyWithWhereWithoutUserInput)
  updateMany?: Array<InvestmentUpdateManyWithWhereWithoutUserInput>;
  @Field(() => [InvestmentScalarWhereInput], { nullable: true })
  @Type(() => InvestmentScalarWhereInput)
  deleteMany?: Array<InvestmentScalarWhereInput>;
}

@InputType()
export class InvestmentUpdateOneRequiredWithoutTransactionsNestedInput {
  @Field(() => InvestmentCreateWithoutTransactionsInput, { nullable: true })
  @Type(() => InvestmentCreateWithoutTransactionsInput)
  create?: InstanceType<typeof InvestmentCreateWithoutTransactionsInput>;
  @Field(() => InvestmentCreateOrConnectWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => InvestmentCreateOrConnectWithoutTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof InvestmentCreateOrConnectWithoutTransactionsInput
  >;
  @Field(() => InvestmentUpsertWithoutTransactionsInput, { nullable: true })
  @Type(() => InvestmentUpsertWithoutTransactionsInput)
  upsert?: InstanceType<typeof InvestmentUpsertWithoutTransactionsInput>;
  @Field(() => InvestmentWhereUniqueInput, { nullable: true })
  @Type(() => InvestmentWhereUniqueInput)
  connect?: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentUpdateToOneWithWhereWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateToOneWithWhereWithoutTransactionsInput)
  update?: InstanceType<
    typeof InvestmentUpdateToOneWithWhereWithoutTransactionsInput
  >;
}

@InputType()
export class InvestmentUpdateToOneWithWhereWithoutTransactionsInput {
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
  @Field(() => InvestmentUpdateWithoutTransactionsInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutTransactionsInput)
  data!: InstanceType<typeof InvestmentUpdateWithoutTransactionsInput>;
}

@InputType()
export class InvestmentUpdateWithWhereUniqueWithoutAccountInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentUpdateWithoutAccountInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutAccountInput)
  data!: InstanceType<typeof InvestmentUpdateWithoutAccountInput>;
}

@InputType()
export class InvestmentUpdateWithWhereUniqueWithoutUserInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentUpdateWithoutUserInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutUserInput)
  data!: InstanceType<typeof InvestmentUpdateWithoutUserInput>;
}

@InputType()
export class InvestmentUpdateWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutInvestmentsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutInvestmentsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutInvestmentNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutInvestmentNestedInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutInvestmentNestedInput
  >;
}

@InputType()
export class InvestmentUpdateWithoutTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutInvestmentsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutInvestmentsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
  @Field(() => AccountUpdateOneRequiredWithoutInvestmentsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneRequiredWithoutInvestmentsNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
}

@InputType()
export class InvestmentUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneRequiredWithoutInvestmentsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneRequiredWithoutInvestmentsNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutInvestmentNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutInvestmentNestedInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutInvestmentNestedInput
  >;
}

@InputType()
export class InvestmentUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  correctedAmount?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  taxedAmount?: InstanceType<typeof NullableFloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof NullableIntFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  finishedAt?: InstanceType<typeof NullableDateTimeFieldUpdateOperationsInput>;
  @Field(() => NullableDateTimeFieldUpdateOperationsInput, { nullable: true })
  lastCorrectedAt?: InstanceType<
    typeof NullableDateTimeFieldUpdateOperationsInput
  >;
  @Field(() => EnumInvestmentStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumInvestmentStatusFieldUpdateOperationsInput>;
  @Field(() => EnumRegimeFieldUpdateOperationsInput, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFieldUpdateOperationsInput>;
  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  regimePercentage?: InstanceType<
    typeof NullableFloatFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => UserUpdateOneRequiredWithoutInvestmentsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutInvestmentsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
  @Field(() => AccountUpdateOneRequiredWithoutInvestmentsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneRequiredWithoutInvestmentsNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
  @Field(() => InvestmentTransactionUpdateManyWithoutInvestmentNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithoutInvestmentNestedInput)
  transactions?: InstanceType<
    typeof InvestmentTransactionUpdateManyWithoutInvestmentNestedInput
  >;
}

@InputType()
export class InvestmentUpsertWithWhereUniqueWithoutAccountInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentUpdateWithoutAccountInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutAccountInput)
  update!: InstanceType<typeof InvestmentUpdateWithoutAccountInput>;
  @Field(() => InvestmentCreateWithoutAccountInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutAccountInput)
  create!: InstanceType<typeof InvestmentCreateWithoutAccountInput>;
}

@InputType()
export class InvestmentUpsertWithWhereUniqueWithoutUserInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentUpdateWithoutUserInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutUserInput)
  update!: InstanceType<typeof InvestmentUpdateWithoutUserInput>;
  @Field(() => InvestmentCreateWithoutUserInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutUserInput)
  create!: InstanceType<typeof InvestmentCreateWithoutUserInput>;
}

@InputType()
export class InvestmentUpsertWithoutTransactionsInput {
  @Field(() => InvestmentUpdateWithoutTransactionsInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutTransactionsInput)
  update!: InstanceType<typeof InvestmentUpdateWithoutTransactionsInput>;
  @Field(() => InvestmentCreateWithoutTransactionsInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutTransactionsInput)
  create!: InstanceType<typeof InvestmentCreateWithoutTransactionsInput>;
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
}

@InputType()
export class InvestmentWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => [InvestmentWhereInput], { nullable: true })
  AND?: Array<InvestmentWhereInput>;
  @Field(() => [InvestmentWhereInput], { nullable: true })
  OR?: Array<InvestmentWhereInput>;
  @Field(() => [InvestmentWhereInput], { nullable: true })
  NOT?: Array<InvestmentWhereInput>;
  @Field(() => FloatFilter, { nullable: true })
  amount?: InstanceType<typeof FloatFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  correctedAmount?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  taxedAmount?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFilter>;
  @Field(() => IntNullableFilter, { nullable: true })
  duration?: InstanceType<typeof IntNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  finishedAt?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  lastCorrectedAt?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => EnumInvestmentStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumInvestmentStatusFilter>;
  @Field(() => EnumRegimeFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  @Type(() => UserRelationFilter)
  user?: InstanceType<typeof UserRelationFilter>;
  @Field(() => AccountRelationFilter, { nullable: true })
  @Type(() => AccountRelationFilter)
  account?: InstanceType<typeof AccountRelationFilter>;
  @Field(() => InvestmentTransactionListRelationFilter, { nullable: true })
  @Type(() => InvestmentTransactionListRelationFilter)
  transactions?: InstanceType<typeof InvestmentTransactionListRelationFilter>;
}

@InputType()
export class InvestmentWhereInput {
  @Field(() => [InvestmentWhereInput], { nullable: true })
  AND?: Array<InvestmentWhereInput>;
  @Field(() => [InvestmentWhereInput], { nullable: true })
  OR?: Array<InvestmentWhereInput>;
  @Field(() => [InvestmentWhereInput], { nullable: true })
  NOT?: Array<InvestmentWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => FloatFilter, { nullable: true })
  amount?: InstanceType<typeof FloatFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  correctedAmount?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  taxedAmount?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFilter>;
  @Field(() => IntNullableFilter, { nullable: true })
  duration?: InstanceType<typeof IntNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  finishedAt?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => DateTimeNullableFilter, { nullable: true })
  lastCorrectedAt?: InstanceType<typeof DateTimeNullableFilter>;
  @Field(() => EnumInvestmentStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumInvestmentStatusFilter>;
  @Field(() => EnumRegimeFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  @Type(() => UserRelationFilter)
  user?: InstanceType<typeof UserRelationFilter>;
  @Field(() => AccountRelationFilter, { nullable: true })
  @Type(() => AccountRelationFilter)
  account?: InstanceType<typeof AccountRelationFilter>;
  @Field(() => InvestmentTransactionListRelationFilter, { nullable: true })
  @Type(() => InvestmentTransactionListRelationFilter)
  transactions?: InstanceType<typeof InvestmentTransactionListRelationFilter>;
}

@ObjectType()
export class Investment {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Float, { nullable: true })
  correctedAmount!: number | null;
  @Field(() => Float, { nullable: true })
  taxedAmount!: number | null;
  @Field(() => Date, { nullable: false })
  startDate!: Date;
  @Field(() => Int, { nullable: true })
  duration!: number | null;
  @Field(() => Date, { nullable: true })
  finishedAt!: Date | null;
  @Field(() => Date, { nullable: true })
  lastCorrectedAt!: Date | null;
  @Field(() => InvestmentStatus, { nullable: false, defaultValue: 'OPEN' })
  status!: keyof typeof InvestmentStatus;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true, defaultValue: 100 })
  regimePercentage!: number | null;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => User, { nullable: false })
  user?: InstanceType<typeof User>;
  @Field(() => Account, { nullable: false })
  account?: InstanceType<typeof Account>;
  @Field(() => [InvestmentTransaction], { nullable: true })
  transactions?: Array<InvestmentTransaction>;
  @Field(() => InvestmentCount, { nullable: false })
  _count?: InstanceType<typeof InvestmentCount>;
}

@ArgsType()
export class UpdateManyInvestmentArgs {
  @Field(() => InvestmentUpdateManyMutationInput, { nullable: false })
  @Type(() => InvestmentUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentUpdateManyMutationInput>;
  @Field(() => InvestmentWhereInput, { nullable: true })
  @Type(() => InvestmentWhereInput)
  where?: InstanceType<typeof InvestmentWhereInput>;
}

@ArgsType()
export class UpdateOneInvestmentArgs {
  @Field(() => InvestmentUpdateInput, { nullable: false })
  @Type(() => InvestmentUpdateInput)
  data!: InstanceType<typeof InvestmentUpdateInput>;
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneInvestmentArgs {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentCreateInput, { nullable: false })
  @Type(() => InvestmentCreateInput)
  create!: InstanceType<typeof InvestmentCreateInput>;
  @Field(() => InvestmentUpdateInput, { nullable: false })
  @Type(() => InvestmentUpdateInput)
  update!: InstanceType<typeof InvestmentUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ObjectType()
export class AggregateInvestmentTransaction {
  @Field(() => InvestmentTransactionCountAggregate, { nullable: true })
  _count?: InstanceType<typeof InvestmentTransactionCountAggregate>;
  @Field(() => InvestmentTransactionAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof InvestmentTransactionAvgAggregate>;
  @Field(() => InvestmentTransactionSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof InvestmentTransactionSumAggregate>;
  @Field(() => InvestmentTransactionMinAggregate, { nullable: true })
  _min?: InstanceType<typeof InvestmentTransactionMinAggregate>;
  @Field(() => InvestmentTransactionMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof InvestmentTransactionMaxAggregate>;
}

@ArgsType()
export class CreateManyInvestmentTransactionArgs {
  @Field(() => [InvestmentTransactionCreateManyInput], { nullable: false })
  @Type(() => InvestmentTransactionCreateManyInput)
  data!: Array<InvestmentTransactionCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionCreateInput, { nullable: false })
  @Type(() => InvestmentTransactionCreateInput)
  data!: InstanceType<typeof InvestmentTransactionCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
}

@ArgsType()
export class DeleteOneInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstInvestmentTransactionOrThrowArgs {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionOrderByWithRelationInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByWithRelationInput)
  orderBy?: Array<InvestmentTransactionOrderByWithRelationInput>;
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InvestmentTransactionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InvestmentTransactionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionOrderByWithRelationInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByWithRelationInput)
  orderBy?: Array<InvestmentTransactionOrderByWithRelationInput>;
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InvestmentTransactionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InvestmentTransactionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionOrderByWithRelationInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByWithRelationInput)
  orderBy?: Array<InvestmentTransactionOrderByWithRelationInput>;
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [InvestmentTransactionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof InvestmentTransactionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueInvestmentTransactionOrThrowArgs {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class InvestmentTransactionAggregateArgs {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionOrderByWithRelationInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByWithRelationInput)
  orderBy?: Array<InvestmentTransactionOrderByWithRelationInput>;
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => InvestmentTransactionCountAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionCountAggregateInput)
  _count?: InstanceType<typeof InvestmentTransactionCountAggregateInput>;
  @Field(() => InvestmentTransactionAvgAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionAvgAggregateInput)
  _avg?: InstanceType<typeof InvestmentTransactionAvgAggregateInput>;
  @Field(() => InvestmentTransactionSumAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionSumAggregateInput)
  _sum?: InstanceType<typeof InvestmentTransactionSumAggregateInput>;
  @Field(() => InvestmentTransactionMinAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionMinAggregateInput)
  _min?: InstanceType<typeof InvestmentTransactionMinAggregateInput>;
  @Field(() => InvestmentTransactionMaxAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionMaxAggregateInput)
  _max?: InstanceType<typeof InvestmentTransactionMaxAggregateInput>;
}

@InputType()
export class InvestmentTransactionAvgAggregateInput {
  @Field(() => Boolean, { nullable: true })
  amount?: true;
}

@ObjectType()
export class InvestmentTransactionAvgAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
}

@InputType()
export class InvestmentTransactionAvgOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentTransactionCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  role?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  investmentId?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class InvestmentTransactionCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  role!: number;
  @Field(() => Int, { nullable: false })
  amount!: number;
  @Field(() => Int, { nullable: false })
  investmentId!: number;
  @Field(() => Int, { nullable: false })
  accountId!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class InvestmentTransactionCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  investmentId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentTransactionCreateManyAccountInputEnvelope {
  @Field(() => [InvestmentTransactionCreateManyAccountInput], {
    nullable: false,
  })
  @Type(() => InvestmentTransactionCreateManyAccountInput)
  data!: Array<InvestmentTransactionCreateManyAccountInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class InvestmentTransactionCreateManyAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  investmentId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionCreateManyInvestmentInputEnvelope {
  @Field(() => [InvestmentTransactionCreateManyInvestmentInput], {
    nullable: false,
  })
  @Type(() => InvestmentTransactionCreateManyInvestmentInput)
  data!: Array<InvestmentTransactionCreateManyInvestmentInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class InvestmentTransactionCreateManyInvestmentInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  investmentId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionCreateNestedManyWithoutAccountInput {
  @Field(() => [InvestmentTransactionCreateWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutAccountInput)
  create?: Array<InvestmentTransactionCreateWithoutAccountInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutAccountInput>;
  @Field(() => InvestmentTransactionCreateManyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyAccountInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentTransactionCreateNestedManyWithoutInvestmentInput {
  @Field(() => [InvestmentTransactionCreateWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutInvestmentInput)
  create?: Array<InvestmentTransactionCreateWithoutInvestmentInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutInvestmentInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutInvestmentInput>;
  @Field(() => InvestmentTransactionCreateManyInvestmentInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyInvestmentInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyInvestmentInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentTransactionCreateOrConnectWithoutAccountInput {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionCreateWithoutAccountInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionCreateWithoutAccountInput)
  create!: InstanceType<typeof InvestmentTransactionCreateWithoutAccountInput>;
}

@InputType()
export class InvestmentTransactionCreateOrConnectWithoutInvestmentInput {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionCreateWithoutInvestmentInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionCreateWithoutInvestmentInput)
  create!: InstanceType<
    typeof InvestmentTransactionCreateWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentTransactionCreateWithoutAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => InvestmentCreateNestedOneWithoutTransactionsInput, {
    nullable: false,
  })
  @Type(() => InvestmentCreateNestedOneWithoutTransactionsInput)
  investment!: InstanceType<
    typeof InvestmentCreateNestedOneWithoutTransactionsInput
  >;
}

@InputType()
export class InvestmentTransactionCreateWithoutInvestmentInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutInvestmentTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutInvestmentTransactionsInput)
  account!: InstanceType<
    typeof AccountCreateNestedOneWithoutInvestmentTransactionsInput
  >;
}

@InputType()
export class InvestmentTransactionCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => InvestmentCreateNestedOneWithoutTransactionsInput, {
    nullable: false,
  })
  @Type(() => InvestmentCreateNestedOneWithoutTransactionsInput)
  investment!: InstanceType<
    typeof InvestmentCreateNestedOneWithoutTransactionsInput
  >;
  @Field(() => AccountCreateNestedOneWithoutInvestmentTransactionsInput, {
    nullable: false,
  })
  @Type(() => AccountCreateNestedOneWithoutInvestmentTransactionsInput)
  account!: InstanceType<
    typeof AccountCreateNestedOneWithoutInvestmentTransactionsInput
  >;
}

@ArgsType()
export class InvestmentTransactionGroupByArgs {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionOrderByWithAggregationInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionOrderByWithAggregationInput)
  orderBy?: Array<InvestmentTransactionOrderByWithAggregationInput>;
  @Field(() => [InvestmentTransactionScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof InvestmentTransactionScalarFieldEnum>;
  @Field(() => InvestmentTransactionScalarWhereWithAggregatesInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionScalarWhereWithAggregatesInput)
  having?: InstanceType<
    typeof InvestmentTransactionScalarWhereWithAggregatesInput
  >;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => InvestmentTransactionCountAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionCountAggregateInput)
  _count?: InstanceType<typeof InvestmentTransactionCountAggregateInput>;
  @Field(() => InvestmentTransactionAvgAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionAvgAggregateInput)
  _avg?: InstanceType<typeof InvestmentTransactionAvgAggregateInput>;
  @Field(() => InvestmentTransactionSumAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionSumAggregateInput)
  _sum?: InstanceType<typeof InvestmentTransactionSumAggregateInput>;
  @Field(() => InvestmentTransactionMinAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionMinAggregateInput)
  _min?: InstanceType<typeof InvestmentTransactionMinAggregateInput>;
  @Field(() => InvestmentTransactionMaxAggregateInput, { nullable: true })
  @Type(() => InvestmentTransactionMaxAggregateInput)
  _max?: InstanceType<typeof InvestmentTransactionMaxAggregateInput>;
}

@ObjectType()
export class InvestmentTransactionGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  investmentId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => InvestmentTransactionCountAggregate, { nullable: true })
  _count?: InstanceType<typeof InvestmentTransactionCountAggregate>;
  @Field(() => InvestmentTransactionAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof InvestmentTransactionAvgAggregate>;
  @Field(() => InvestmentTransactionSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof InvestmentTransactionSumAggregate>;
  @Field(() => InvestmentTransactionMinAggregate, { nullable: true })
  _min?: InstanceType<typeof InvestmentTransactionMinAggregate>;
  @Field(() => InvestmentTransactionMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof InvestmentTransactionMaxAggregate>;
}

@InputType()
export class InvestmentTransactionListRelationFilter {
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  every?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  some?: InstanceType<typeof InvestmentTransactionWhereInput>;
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  none?: InstanceType<typeof InvestmentTransactionWhereInput>;
}

@InputType()
export class InvestmentTransactionMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  role?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  investmentId?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class InvestmentTransactionMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: true })
  role?: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
  @Field(() => String, { nullable: true })
  investmentId?: string;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  investmentId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentTransactionMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  role?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  investmentId?: true;
  @Field(() => Boolean, { nullable: true })
  accountId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class InvestmentTransactionMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: true })
  role?: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
  @Field(() => String, { nullable: true })
  investmentId?: string;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  investmentId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentTransactionOrderByRelationAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  _count?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentTransactionOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  investmentId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => InvestmentTransactionCountOrderByAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCountOrderByAggregateInput)
  _count?: InstanceType<typeof InvestmentTransactionCountOrderByAggregateInput>;
  @Field(() => InvestmentTransactionAvgOrderByAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionAvgOrderByAggregateInput)
  _avg?: InstanceType<typeof InvestmentTransactionAvgOrderByAggregateInput>;
  @Field(() => InvestmentTransactionMaxOrderByAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionMaxOrderByAggregateInput)
  _max?: InstanceType<typeof InvestmentTransactionMaxOrderByAggregateInput>;
  @Field(() => InvestmentTransactionMinOrderByAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionMinOrderByAggregateInput)
  _min?: InstanceType<typeof InvestmentTransactionMinOrderByAggregateInput>;
  @Field(() => InvestmentTransactionSumOrderByAggregateInput, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionSumOrderByAggregateInput)
  _sum?: InstanceType<typeof InvestmentTransactionSumOrderByAggregateInput>;
}

@InputType()
export class InvestmentTransactionOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  investmentId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  accountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => InvestmentOrderByWithRelationInput, { nullable: true })
  @Type(() => InvestmentOrderByWithRelationInput)
  investment?: InstanceType<typeof InvestmentOrderByWithRelationInput>;
  @Field(() => AccountOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  account?: InstanceType<typeof AccountOrderByWithRelationInput>;
}

@InputType()
export class InvestmentTransactionScalarWhereWithAggregatesInput {
  @Field(() => [InvestmentTransactionScalarWhereWithAggregatesInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionScalarWhereWithAggregatesInput)
  AND?: Array<InvestmentTransactionScalarWhereWithAggregatesInput>;
  @Field(() => [InvestmentTransactionScalarWhereWithAggregatesInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionScalarWhereWithAggregatesInput)
  OR?: Array<InvestmentTransactionScalarWhereWithAggregatesInput>;
  @Field(() => [InvestmentTransactionScalarWhereWithAggregatesInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionScalarWhereWithAggregatesInput)
  NOT?: Array<InvestmentTransactionScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => EnumInvestmentTransactionRoleWithAggregatesFilter, {
    nullable: true,
  })
  role?: InstanceType<typeof EnumInvestmentTransactionRoleWithAggregatesFilter>;
  @Field(() => DecimalWithAggregatesFilter, { nullable: true })
  @Type(() => DecimalWithAggregatesFilter)
  amount?: InstanceType<typeof DecimalWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  investmentId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  accountId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class InvestmentTransactionScalarWhereInput {
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  AND?: Array<InvestmentTransactionScalarWhereInput>;
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  OR?: Array<InvestmentTransactionScalarWhereInput>;
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  NOT?: Array<InvestmentTransactionScalarWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => EnumInvestmentTransactionRoleFilter, { nullable: true })
  role?: InstanceType<typeof EnumInvestmentTransactionRoleFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  amount?: InstanceType<typeof DecimalFilter>;
  @Field(() => StringFilter, { nullable: true })
  investmentId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class InvestmentTransactionSumAggregateInput {
  @Field(() => Boolean, { nullable: true })
  amount?: true;
}

@ObjectType()
export class InvestmentTransactionSumAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
}

@InputType()
export class InvestmentTransactionSumOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
}

@InputType()
export class InvestmentTransactionUncheckedCreateNestedManyWithoutAccountInput {
  @Field(() => [InvestmentTransactionCreateWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutAccountInput)
  create?: Array<InvestmentTransactionCreateWithoutAccountInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutAccountInput>;
  @Field(() => InvestmentTransactionCreateManyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyAccountInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentTransactionUncheckedCreateNestedManyWithoutInvestmentInput {
  @Field(() => [InvestmentTransactionCreateWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutInvestmentInput)
  create?: Array<InvestmentTransactionCreateWithoutInvestmentInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutInvestmentInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutInvestmentInput>;
  @Field(() => InvestmentTransactionCreateManyInvestmentInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyInvestmentInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyInvestmentInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class InvestmentTransactionUncheckedCreateWithoutAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  investmentId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionUncheckedCreateWithoutInvestmentInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  investmentId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateManyWithoutAccountNestedInput {
  @Field(() => [InvestmentTransactionCreateWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutAccountInput)
  create?: Array<InvestmentTransactionCreateWithoutAccountInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutAccountInput>;
  @Field(
    () => [InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput)
  upsert?: Array<InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput>;
  @Field(() => InvestmentTransactionCreateManyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyAccountInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  disconnect?: Array<
    Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(
    () => [InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput)
  update?: Array<InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput>;
  @Field(() => [InvestmentTransactionUpdateManyWithWhereWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithWhereWithoutAccountInput)
  updateMany?: Array<InvestmentTransactionUpdateManyWithWhereWithoutAccountInput>;
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  deleteMany?: Array<InvestmentTransactionScalarWhereInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateManyWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  investmentId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateManyWithoutInvestmentNestedInput {
  @Field(() => [InvestmentTransactionCreateWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutInvestmentInput)
  create?: Array<InvestmentTransactionCreateWithoutInvestmentInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutInvestmentInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutInvestmentInput>;
  @Field(
    () => [InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput)
  upsert?: Array<InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput>;
  @Field(() => InvestmentTransactionCreateManyInvestmentInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyInvestmentInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyInvestmentInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  disconnect?: Array<
    Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(
    () => [InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput)
  update?: Array<InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput>;
  @Field(
    () => [InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput)
  updateMany?: Array<InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput>;
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  deleteMany?: Array<InvestmentTransactionScalarWhereInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateManyWithoutInvestmentInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  investmentId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  investmentId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateWithoutInvestmentInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  investmentId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  accountId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class InvestmentTransactionUpdateManyWithWhereWithoutAccountInput {
  @Field(() => InvestmentTransactionScalarWhereInput, { nullable: false })
  @Type(() => InvestmentTransactionScalarWhereInput)
  where!: InstanceType<typeof InvestmentTransactionScalarWhereInput>;
  @Field(() => InvestmentTransactionUpdateManyMutationInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentTransactionUpdateManyMutationInput>;
}

@InputType()
export class InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput {
  @Field(() => InvestmentTransactionScalarWhereInput, { nullable: false })
  @Type(() => InvestmentTransactionScalarWhereInput)
  where!: InstanceType<typeof InvestmentTransactionScalarWhereInput>;
  @Field(() => InvestmentTransactionUpdateManyMutationInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentTransactionUpdateManyMutationInput>;
}

@InputType()
export class InvestmentTransactionUpdateManyWithoutAccountNestedInput {
  @Field(() => [InvestmentTransactionCreateWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutAccountInput)
  create?: Array<InvestmentTransactionCreateWithoutAccountInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutAccountInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutAccountInput>;
  @Field(
    () => [InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput)
  upsert?: Array<InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput>;
  @Field(() => InvestmentTransactionCreateManyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyAccountInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  disconnect?: Array<
    Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(
    () => [InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput)
  update?: Array<InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput>;
  @Field(() => [InvestmentTransactionUpdateManyWithWhereWithoutAccountInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionUpdateManyWithWhereWithoutAccountInput)
  updateMany?: Array<InvestmentTransactionUpdateManyWithWhereWithoutAccountInput>;
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  deleteMany?: Array<InvestmentTransactionScalarWhereInput>;
}

@InputType()
export class InvestmentTransactionUpdateManyWithoutInvestmentNestedInput {
  @Field(() => [InvestmentTransactionCreateWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateWithoutInvestmentInput)
  create?: Array<InvestmentTransactionCreateWithoutInvestmentInput>;
  @Field(() => [InvestmentTransactionCreateOrConnectWithoutInvestmentInput], {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateOrConnectWithoutInvestmentInput)
  connectOrCreate?: Array<InvestmentTransactionCreateOrConnectWithoutInvestmentInput>;
  @Field(
    () => [InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput)
  upsert?: Array<InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput>;
  @Field(() => InvestmentTransactionCreateManyInvestmentInputEnvelope, {
    nullable: true,
  })
  @Type(() => InvestmentTransactionCreateManyInvestmentInputEnvelope)
  createMany?: InstanceType<
    typeof InvestmentTransactionCreateManyInvestmentInputEnvelope
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  disconnect?: Array<
    Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>
  >;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(() => [InvestmentTransactionWhereUniqueInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>>;
  @Field(
    () => [InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput)
  update?: Array<InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput>;
  @Field(
    () => [InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput],
    { nullable: true },
  )
  @Type(() => InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput)
  updateMany?: Array<InvestmentTransactionUpdateManyWithWhereWithoutInvestmentInput>;
  @Field(() => [InvestmentTransactionScalarWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionScalarWhereInput)
  deleteMany?: Array<InvestmentTransactionScalarWhereInput>;
}

@InputType()
export class InvestmentTransactionUpdateWithWhereUniqueWithoutAccountInput {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionUpdateWithoutAccountInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateWithoutAccountInput)
  data!: InstanceType<typeof InvestmentTransactionUpdateWithoutAccountInput>;
}

@InputType()
export class InvestmentTransactionUpdateWithWhereUniqueWithoutInvestmentInput {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionUpdateWithoutInvestmentInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateWithoutInvestmentInput)
  data!: InstanceType<typeof InvestmentTransactionUpdateWithoutInvestmentInput>;
}

@InputType()
export class InvestmentTransactionUpdateWithoutAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => InvestmentUpdateOneRequiredWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateOneRequiredWithoutTransactionsNestedInput)
  investment?: InstanceType<
    typeof InvestmentUpdateOneRequiredWithoutTransactionsNestedInput
  >;
}

@InputType()
export class InvestmentTransactionUpdateWithoutInvestmentInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(
    () => AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput,
    { nullable: true },
  )
  @Type(() => AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput
  >;
}

@InputType()
export class InvestmentTransactionUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumInvestmentTransactionRoleFieldUpdateOperationsInput, {
    nullable: true,
  })
  role?: InstanceType<
    typeof EnumInvestmentTransactionRoleFieldUpdateOperationsInput
  >;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => InvestmentUpdateOneRequiredWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUpdateOneRequiredWithoutTransactionsNestedInput)
  investment?: InstanceType<
    typeof InvestmentUpdateOneRequiredWithoutTransactionsNestedInput
  >;
  @Field(
    () => AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput,
    { nullable: true },
  )
  @Type(() => AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput)
  account?: InstanceType<
    typeof AccountUpdateOneRequiredWithoutInvestmentTransactionsNestedInput
  >;
}

@InputType()
export class InvestmentTransactionUpsertWithWhereUniqueWithoutAccountInput {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionUpdateWithoutAccountInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateWithoutAccountInput)
  update!: InstanceType<typeof InvestmentTransactionUpdateWithoutAccountInput>;
  @Field(() => InvestmentTransactionCreateWithoutAccountInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionCreateWithoutAccountInput)
  create!: InstanceType<typeof InvestmentTransactionCreateWithoutAccountInput>;
}

@InputType()
export class InvestmentTransactionUpsertWithWhereUniqueWithoutInvestmentInput {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionUpdateWithoutInvestmentInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateWithoutInvestmentInput)
  update!: InstanceType<
    typeof InvestmentTransactionUpdateWithoutInvestmentInput
  >;
  @Field(() => InvestmentTransactionCreateWithoutInvestmentInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionCreateWithoutInvestmentInput)
  create!: InstanceType<
    typeof InvestmentTransactionCreateWithoutInvestmentInput
  >;
}

@InputType()
export class InvestmentTransactionWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => [InvestmentTransactionWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  AND?: Array<InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  OR?: Array<InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  NOT?: Array<InvestmentTransactionWhereInput>;
  @Field(() => EnumInvestmentTransactionRoleFilter, { nullable: true })
  role?: InstanceType<typeof EnumInvestmentTransactionRoleFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  amount?: InstanceType<typeof DecimalFilter>;
  @Field(() => StringFilter, { nullable: true })
  investmentId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => InvestmentRelationFilter, { nullable: true })
  @Type(() => InvestmentRelationFilter)
  investment?: InstanceType<typeof InvestmentRelationFilter>;
  @Field(() => AccountRelationFilter, { nullable: true })
  @Type(() => AccountRelationFilter)
  account?: InstanceType<typeof AccountRelationFilter>;
}

@InputType()
export class InvestmentTransactionWhereInput {
  @Field(() => [InvestmentTransactionWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  AND?: Array<InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  OR?: Array<InvestmentTransactionWhereInput>;
  @Field(() => [InvestmentTransactionWhereInput], { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  NOT?: Array<InvestmentTransactionWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => EnumInvestmentTransactionRoleFilter, { nullable: true })
  role?: InstanceType<typeof EnumInvestmentTransactionRoleFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  amount?: InstanceType<typeof DecimalFilter>;
  @Field(() => StringFilter, { nullable: true })
  investmentId?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  accountId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => InvestmentRelationFilter, { nullable: true })
  @Type(() => InvestmentRelationFilter)
  investment?: InstanceType<typeof InvestmentRelationFilter>;
  @Field(() => AccountRelationFilter, { nullable: true })
  @Type(() => AccountRelationFilter)
  account?: InstanceType<typeof AccountRelationFilter>;
}

@ObjectType()
export class InvestmentTransaction {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => InvestmentTransactionRole, { nullable: false })
  role!: keyof typeof InvestmentTransactionRole;
  @Field(() => GraphQLDecimal, { nullable: false })
  amount!: Decimal;
  @Field(() => String, { nullable: false })
  investmentId!: string;
  @Field(() => String, { nullable: false })
  accountId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => Investment, { nullable: false })
  investment?: InstanceType<typeof Investment>;
  @Field(() => Account, { nullable: false })
  account?: InstanceType<typeof Account>;
}

@ArgsType()
export class UpdateManyInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionUpdateManyMutationInput, {
    nullable: false,
  })
  @Type(() => InvestmentTransactionUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentTransactionUpdateManyMutationInput>;
  @Field(() => InvestmentTransactionWhereInput, { nullable: true })
  @Type(() => InvestmentTransactionWhereInput)
  where?: InstanceType<typeof InvestmentTransactionWhereInput>;
}

@ArgsType()
export class UpdateOneInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionUpdateInput, { nullable: false })
  @Type(() => InvestmentTransactionUpdateInput)
  data!: InstanceType<typeof InvestmentTransactionUpdateInput>;
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneInvestmentTransactionArgs {
  @Field(() => InvestmentTransactionWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentTransactionWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentTransactionWhereUniqueInput, 'id'>;
  @Field(() => InvestmentTransactionCreateInput, { nullable: false })
  @Type(() => InvestmentTransactionCreateInput)
  create!: InstanceType<typeof InvestmentTransactionCreateInput>;
  @Field(() => InvestmentTransactionUpdateInput, { nullable: false })
  @Type(() => InvestmentTransactionUpdateInput)
  update!: InstanceType<typeof InvestmentTransactionUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ObjectType()
export class AffectedRows {
  @Field(() => Int, { nullable: false })
  count!: number;
}

@InputType()
export class BoolFieldUpdateOperationsInput {
  @Field(() => Boolean, { nullable: true })
  set?: boolean;
}

@InputType()
export class BoolFilter {
  @Field(() => Boolean, { nullable: true })
  equals?: boolean;
  @Field(() => NestedBoolFilter, { nullable: true })
  not?: InstanceType<typeof NestedBoolFilter>;
}

@InputType()
export class BoolWithAggregatesFilter {
  @Field(() => Boolean, { nullable: true })
  equals?: boolean;
  @Field(() => NestedBoolWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedBoolWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedBoolFilter, { nullable: true })
  _min?: InstanceType<typeof NestedBoolFilter>;
  @Field(() => NestedBoolFilter, { nullable: true })
  _max?: InstanceType<typeof NestedBoolFilter>;
}

@InputType()
export class DateTimeFieldUpdateOperationsInput {
  @Field(() => Date, { nullable: true })
  set?: Date | string;
}

@InputType()
export class DateTimeFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeFilter>;
}

@InputType()
export class DateTimeNullableFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeNullableFilter>;
}

@InputType()
export class DateTimeNullableWithAggregatesFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedDateTimeNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDateTimeNullableFilter>;
  @Field(() => NestedDateTimeNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDateTimeNullableFilter>;
}

@InputType()
export class DateTimeWithAggregatesFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedDateTimeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDateTimeFilter>;
  @Field(() => NestedDateTimeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDateTimeFilter>;
}

@InputType()
export class DecimalFieldUpdateOperationsInput {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  set?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  increment?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  decrement?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  multiply?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  divide?: Decimal;
}

@InputType()
export class DecimalFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalFilter>;
}

@InputType()
export class DecimalNullableFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalNullableFilter>;
}

@InputType()
export class DecimalNullableWithAggregatesFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedDecimalNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedDecimalNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDecimalNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDecimalNullableFilter>;
}

@InputType()
export class DecimalWithAggregatesFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedDecimalFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedDecimalFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDecimalFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDecimalFilter>;
}

@InputType()
export class EnumAccountTypeFieldUpdateOperationsInput {
  @Field(() => AccountType, { nullable: true })
  set?: keyof typeof AccountType;
}

@InputType()
export class EnumAccountTypeFilter {
  @Field(() => AccountType, { nullable: true })
  equals?: keyof typeof AccountType;
  @Field(() => [AccountType], { nullable: true })
  in?: Array<keyof typeof AccountType>;
  @Field(() => [AccountType], { nullable: true })
  notIn?: Array<keyof typeof AccountType>;
  @Field(() => NestedEnumAccountTypeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumAccountTypeFilter>;
}

@InputType()
export class EnumAccountTypeNullableListFilter {
  @Field(() => [AccountType], { nullable: true })
  equals?: Array<keyof typeof AccountType>;
  @Field(() => AccountType, { nullable: true })
  has?: keyof typeof AccountType;
  @Field(() => [AccountType], { nullable: true })
  hasEvery?: Array<keyof typeof AccountType>;
  @Field(() => [AccountType], { nullable: true })
  hasSome?: Array<keyof typeof AccountType>;
  @Field(() => Boolean, { nullable: true })
  isEmpty?: boolean;
}

@InputType()
export class EnumAccountTypeWithAggregatesFilter {
  @Field(() => AccountType, { nullable: true })
  equals?: keyof typeof AccountType;
  @Field(() => [AccountType], { nullable: true })
  in?: Array<keyof typeof AccountType>;
  @Field(() => [AccountType], { nullable: true })
  notIn?: Array<keyof typeof AccountType>;
  @Field(() => NestedEnumAccountTypeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumAccountTypeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumAccountTypeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumAccountTypeFilter>;
  @Field(() => NestedEnumAccountTypeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumAccountTypeFilter>;
}

@InputType()
export class EnumCardBillingStatusFieldUpdateOperationsInput {
  @Field(() => CardBillingStatus, { nullable: true })
  set?: keyof typeof CardBillingStatus;
}

@InputType()
export class EnumCardBillingStatusFilter {
  @Field(() => CardBillingStatus, { nullable: true })
  equals?: keyof typeof CardBillingStatus;
  @Field(() => [CardBillingStatus], { nullable: true })
  in?: Array<keyof typeof CardBillingStatus>;
  @Field(() => [CardBillingStatus], { nullable: true })
  notIn?: Array<keyof typeof CardBillingStatus>;
  @Field(() => NestedEnumCardBillingStatusFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumCardBillingStatusFilter>;
}

@InputType()
export class EnumCardBillingStatusWithAggregatesFilter {
  @Field(() => CardBillingStatus, { nullable: true })
  equals?: keyof typeof CardBillingStatus;
  @Field(() => [CardBillingStatus], { nullable: true })
  in?: Array<keyof typeof CardBillingStatus>;
  @Field(() => [CardBillingStatus], { nullable: true })
  notIn?: Array<keyof typeof CardBillingStatus>;
  @Field(() => NestedEnumCardBillingStatusWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumCardBillingStatusWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumCardBillingStatusFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumCardBillingStatusFilter>;
  @Field(() => NestedEnumCardBillingStatusFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumCardBillingStatusFilter>;
}

@InputType()
export class EnumCardTypeFieldUpdateOperationsInput {
  @Field(() => CardType, { nullable: true })
  set?: keyof typeof CardType;
}

@InputType()
export class EnumCardTypeFilter {
  @Field(() => CardType, { nullable: true })
  equals?: keyof typeof CardType;
  @Field(() => [CardType], { nullable: true })
  in?: Array<keyof typeof CardType>;
  @Field(() => [CardType], { nullable: true })
  notIn?: Array<keyof typeof CardType>;
  @Field(() => NestedEnumCardTypeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumCardTypeFilter>;
}

@InputType()
export class EnumCardTypeWithAggregatesFilter {
  @Field(() => CardType, { nullable: true })
  equals?: keyof typeof CardType;
  @Field(() => [CardType], { nullable: true })
  in?: Array<keyof typeof CardType>;
  @Field(() => [CardType], { nullable: true })
  notIn?: Array<keyof typeof CardType>;
  @Field(() => NestedEnumCardTypeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumCardTypeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumCardTypeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumCardTypeFilter>;
  @Field(() => NestedEnumCardTypeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumCardTypeFilter>;
}

@InputType()
export class EnumInvestmentStatusFieldUpdateOperationsInput {
  @Field(() => InvestmentStatus, { nullable: true })
  set?: keyof typeof InvestmentStatus;
}

@InputType()
export class EnumInvestmentStatusFilter {
  @Field(() => InvestmentStatus, { nullable: true })
  equals?: keyof typeof InvestmentStatus;
  @Field(() => [InvestmentStatus], { nullable: true })
  in?: Array<keyof typeof InvestmentStatus>;
  @Field(() => [InvestmentStatus], { nullable: true })
  notIn?: Array<keyof typeof InvestmentStatus>;
  @Field(() => NestedEnumInvestmentStatusFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumInvestmentStatusFilter>;
}

@InputType()
export class EnumInvestmentStatusWithAggregatesFilter {
  @Field(() => InvestmentStatus, { nullable: true })
  equals?: keyof typeof InvestmentStatus;
  @Field(() => [InvestmentStatus], { nullable: true })
  in?: Array<keyof typeof InvestmentStatus>;
  @Field(() => [InvestmentStatus], { nullable: true })
  notIn?: Array<keyof typeof InvestmentStatus>;
  @Field(() => NestedEnumInvestmentStatusWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumInvestmentStatusWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumInvestmentStatusFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumInvestmentStatusFilter>;
  @Field(() => NestedEnumInvestmentStatusFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumInvestmentStatusFilter>;
}

@InputType()
export class EnumInvestmentTransactionRoleFieldUpdateOperationsInput {
  @Field(() => InvestmentTransactionRole, { nullable: true })
  set?: keyof typeof InvestmentTransactionRole;
}

@InputType()
export class EnumInvestmentTransactionRoleFilter {
  @Field(() => InvestmentTransactionRole, { nullable: true })
  equals?: keyof typeof InvestmentTransactionRole;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  in?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  notIn?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => NestedEnumInvestmentTransactionRoleFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumInvestmentTransactionRoleFilter>;
}

@InputType()
export class EnumInvestmentTransactionRoleWithAggregatesFilter {
  @Field(() => InvestmentTransactionRole, { nullable: true })
  equals?: keyof typeof InvestmentTransactionRole;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  in?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  notIn?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => NestedEnumInvestmentTransactionRoleWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<
    typeof NestedEnumInvestmentTransactionRoleWithAggregatesFilter
  >;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumInvestmentTransactionRoleFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumInvestmentTransactionRoleFilter>;
  @Field(() => NestedEnumInvestmentTransactionRoleFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumInvestmentTransactionRoleFilter>;
}

@InputType()
export class EnumPaymentMethodFieldUpdateOperationsInput {
  @Field(() => PaymentMethod, { nullable: true })
  set?: keyof typeof PaymentMethod;
}

@InputType()
export class EnumPaymentMethodFilter {
  @Field(() => PaymentMethod, { nullable: true })
  equals?: keyof typeof PaymentMethod;
  @Field(() => [PaymentMethod], { nullable: true })
  in?: Array<keyof typeof PaymentMethod>;
  @Field(() => [PaymentMethod], { nullable: true })
  notIn?: Array<keyof typeof PaymentMethod>;
  @Field(() => NestedEnumPaymentMethodFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumPaymentMethodFilter>;
}

@InputType()
export class EnumPaymentMethodWithAggregatesFilter {
  @Field(() => PaymentMethod, { nullable: true })
  equals?: keyof typeof PaymentMethod;
  @Field(() => [PaymentMethod], { nullable: true })
  in?: Array<keyof typeof PaymentMethod>;
  @Field(() => [PaymentMethod], { nullable: true })
  notIn?: Array<keyof typeof PaymentMethod>;
  @Field(() => NestedEnumPaymentMethodWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumPaymentMethodWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumPaymentMethodFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumPaymentMethodFilter>;
  @Field(() => NestedEnumPaymentMethodFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumPaymentMethodFilter>;
}

@InputType()
export class EnumRegimeFieldUpdateOperationsInput {
  @Field(() => Regime, { nullable: true })
  set?: keyof typeof Regime;
}

@InputType()
export class EnumRegimeFilter {
  @Field(() => Regime, { nullable: true })
  equals?: keyof typeof Regime;
  @Field(() => [Regime], { nullable: true })
  in?: Array<keyof typeof Regime>;
  @Field(() => [Regime], { nullable: true })
  notIn?: Array<keyof typeof Regime>;
  @Field(() => NestedEnumRegimeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRegimeFilter>;
}

@InputType()
export class EnumRegimeWithAggregatesFilter {
  @Field(() => Regime, { nullable: true })
  equals?: keyof typeof Regime;
  @Field(() => [Regime], { nullable: true })
  in?: Array<keyof typeof Regime>;
  @Field(() => [Regime], { nullable: true })
  notIn?: Array<keyof typeof Regime>;
  @Field(() => NestedEnumRegimeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRegimeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumRegimeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumRegimeFilter>;
  @Field(() => NestedEnumRegimeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumRegimeFilter>;
}

@InputType()
export class EnumRoleFieldUpdateOperationsInput {
  @Field(() => Role, { nullable: true })
  set?: keyof typeof Role;
}

@InputType()
export class EnumRoleFilter {
  @Field(() => Role, { nullable: true })
  equals?: keyof typeof Role;
  @Field(() => [Role], { nullable: true })
  in?: Array<keyof typeof Role>;
  @Field(() => [Role], { nullable: true })
  notIn?: Array<keyof typeof Role>;
  @Field(() => NestedEnumRoleFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRoleFilter>;
}

@InputType()
export class EnumRoleWithAggregatesFilter {
  @Field(() => Role, { nullable: true })
  equals?: keyof typeof Role;
  @Field(() => [Role], { nullable: true })
  in?: Array<keyof typeof Role>;
  @Field(() => [Role], { nullable: true })
  notIn?: Array<keyof typeof Role>;
  @Field(() => NestedEnumRoleWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRoleWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumRoleFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumRoleFilter>;
  @Field(() => NestedEnumRoleFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumRoleFilter>;
}

@InputType()
export class EnumTransactionStatusFieldUpdateOperationsInput {
  @Field(() => TransactionStatus, { nullable: true })
  set?: keyof typeof TransactionStatus;
}

@InputType()
export class EnumTransactionStatusFilter {
  @Field(() => TransactionStatus, { nullable: true })
  equals?: keyof typeof TransactionStatus;
  @Field(() => [TransactionStatus], { nullable: true })
  in?: Array<keyof typeof TransactionStatus>;
  @Field(() => [TransactionStatus], { nullable: true })
  notIn?: Array<keyof typeof TransactionStatus>;
  @Field(() => NestedEnumTransactionStatusFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumTransactionStatusFilter>;
}

@InputType()
export class EnumTransactionStatusWithAggregatesFilter {
  @Field(() => TransactionStatus, { nullable: true })
  equals?: keyof typeof TransactionStatus;
  @Field(() => [TransactionStatus], { nullable: true })
  in?: Array<keyof typeof TransactionStatus>;
  @Field(() => [TransactionStatus], { nullable: true })
  notIn?: Array<keyof typeof TransactionStatus>;
  @Field(() => NestedEnumTransactionStatusWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumTransactionStatusWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumTransactionStatusFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumTransactionStatusFilter>;
  @Field(() => NestedEnumTransactionStatusFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumTransactionStatusFilter>;
}

@InputType()
export class EnumTransactionTypeFieldUpdateOperationsInput {
  @Field(() => TransactionType, { nullable: true })
  set?: keyof typeof TransactionType;
}

@InputType()
export class EnumTransactionTypeFilter {
  @Field(() => TransactionType, { nullable: true })
  equals?: keyof typeof TransactionType;
  @Field(() => [TransactionType], { nullable: true })
  in?: Array<keyof typeof TransactionType>;
  @Field(() => [TransactionType], { nullable: true })
  notIn?: Array<keyof typeof TransactionType>;
  @Field(() => NestedEnumTransactionTypeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumTransactionTypeFilter>;
}

@InputType()
export class EnumTransactionTypeWithAggregatesFilter {
  @Field(() => TransactionType, { nullable: true })
  equals?: keyof typeof TransactionType;
  @Field(() => [TransactionType], { nullable: true })
  in?: Array<keyof typeof TransactionType>;
  @Field(() => [TransactionType], { nullable: true })
  notIn?: Array<keyof typeof TransactionType>;
  @Field(() => NestedEnumTransactionTypeWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumTransactionTypeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumTransactionTypeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumTransactionTypeFilter>;
  @Field(() => NestedEnumTransactionTypeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumTransactionTypeFilter>;
}

@InputType()
export class FloatFieldUpdateOperationsInput {
  @Field(() => Float, { nullable: true })
  set?: number;
  @Field(() => Float, { nullable: true })
  increment?: number;
  @Field(() => Float, { nullable: true })
  decrement?: number;
  @Field(() => Float, { nullable: true })
  multiply?: number;
  @Field(() => Float, { nullable: true })
  divide?: number;
}

@InputType()
export class FloatFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatFilter>;
}

@InputType()
export class FloatNullableFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatNullableFilter>;
}

@InputType()
export class FloatNullableWithAggregatesFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedFloatNullableFilter>;
}

@InputType()
export class FloatWithAggregatesFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _min?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _max?: InstanceType<typeof NestedFloatFilter>;
}

@InputType()
export class IntNullableFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;
  @Field(() => [Int], { nullable: true })
  in?: Array<number>;
  @Field(() => [Int], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Int, { nullable: true })
  lt?: number;
  @Field(() => Int, { nullable: true })
  lte?: number;
  @Field(() => Int, { nullable: true })
  gt?: number;
  @Field(() => Int, { nullable: true })
  gte?: number;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntNullableFilter>;
}

@InputType()
export class IntNullableWithAggregatesFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;
  @Field(() => [Int], { nullable: true })
  in?: Array<number>;
  @Field(() => [Int], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Int, { nullable: true })
  lt?: number;
  @Field(() => Int, { nullable: true })
  lte?: number;
  @Field(() => Int, { nullable: true })
  gt?: number;
  @Field(() => Int, { nullable: true })
  gte?: number;
  @Field(() => NestedIntNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedIntNullableFilter>;
}

@InputType()
export class NestedBoolFilter {
  @Field(() => Boolean, { nullable: true })
  equals?: boolean;
  @Field(() => NestedBoolFilter, { nullable: true })
  not?: InstanceType<typeof NestedBoolFilter>;
}

@InputType()
export class NestedBoolWithAggregatesFilter {
  @Field(() => Boolean, { nullable: true })
  equals?: boolean;
  @Field(() => NestedBoolWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedBoolWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedBoolFilter, { nullable: true })
  _min?: InstanceType<typeof NestedBoolFilter>;
  @Field(() => NestedBoolFilter, { nullable: true })
  _max?: InstanceType<typeof NestedBoolFilter>;
}

@InputType()
export class NestedDateTimeFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeFilter>;
}

@InputType()
export class NestedDateTimeNullableFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeNullableFilter>;
}

@InputType()
export class NestedDateTimeNullableWithAggregatesFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedDateTimeNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDateTimeNullableFilter>;
  @Field(() => NestedDateTimeNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDateTimeNullableFilter>;
}

@InputType()
export class NestedDateTimeWithAggregatesFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;
  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>;
  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>;
  @Field(() => Date, { nullable: true })
  lt?: Date | string;
  @Field(() => Date, { nullable: true })
  lte?: Date | string;
  @Field(() => Date, { nullable: true })
  gt?: Date | string;
  @Field(() => Date, { nullable: true })
  gte?: Date | string;
  @Field(() => NestedDateTimeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDateTimeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedDateTimeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDateTimeFilter>;
  @Field(() => NestedDateTimeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDateTimeFilter>;
}

@InputType()
export class NestedDecimalFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalFilter>;
}

@InputType()
export class NestedDecimalNullableFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalNullableFilter>;
}

@InputType()
export class NestedDecimalNullableWithAggregatesFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedDecimalNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedDecimalNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDecimalNullableFilter>;
  @Field(() => NestedDecimalNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDecimalNullableFilter>;
}

@InputType()
export class NestedDecimalWithAggregatesFilter {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  equals?: Decimal;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  in?: Array<Decimal>;
  @Field(() => [GraphQLDecimal], { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  notIn?: Array<Decimal>;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  lte?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gt?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  gte?: Decimal;
  @Field(() => NestedDecimalWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedDecimalWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedDecimalFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedDecimalFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _min?: InstanceType<typeof NestedDecimalFilter>;
  @Field(() => NestedDecimalFilter, { nullable: true })
  _max?: InstanceType<typeof NestedDecimalFilter>;
}

@InputType()
export class NestedEnumAccountTypeFilter {
  @Field(() => AccountType, { nullable: true })
  equals?: keyof typeof AccountType;
  @Field(() => [AccountType], { nullable: true })
  in?: Array<keyof typeof AccountType>;
  @Field(() => [AccountType], { nullable: true })
  notIn?: Array<keyof typeof AccountType>;
  @Field(() => NestedEnumAccountTypeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumAccountTypeFilter>;
}

@InputType()
export class NestedEnumAccountTypeWithAggregatesFilter {
  @Field(() => AccountType, { nullable: true })
  equals?: keyof typeof AccountType;
  @Field(() => [AccountType], { nullable: true })
  in?: Array<keyof typeof AccountType>;
  @Field(() => [AccountType], { nullable: true })
  notIn?: Array<keyof typeof AccountType>;
  @Field(() => NestedEnumAccountTypeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumAccountTypeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumAccountTypeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumAccountTypeFilter>;
  @Field(() => NestedEnumAccountTypeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumAccountTypeFilter>;
}

@InputType()
export class NestedEnumCardBillingStatusFilter {
  @Field(() => CardBillingStatus, { nullable: true })
  equals?: keyof typeof CardBillingStatus;
  @Field(() => [CardBillingStatus], { nullable: true })
  in?: Array<keyof typeof CardBillingStatus>;
  @Field(() => [CardBillingStatus], { nullable: true })
  notIn?: Array<keyof typeof CardBillingStatus>;
  @Field(() => NestedEnumCardBillingStatusFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumCardBillingStatusFilter>;
}

@InputType()
export class NestedEnumCardBillingStatusWithAggregatesFilter {
  @Field(() => CardBillingStatus, { nullable: true })
  equals?: keyof typeof CardBillingStatus;
  @Field(() => [CardBillingStatus], { nullable: true })
  in?: Array<keyof typeof CardBillingStatus>;
  @Field(() => [CardBillingStatus], { nullable: true })
  notIn?: Array<keyof typeof CardBillingStatus>;
  @Field(() => NestedEnumCardBillingStatusWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumCardBillingStatusWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumCardBillingStatusFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumCardBillingStatusFilter>;
  @Field(() => NestedEnumCardBillingStatusFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumCardBillingStatusFilter>;
}

@InputType()
export class NestedEnumCardTypeFilter {
  @Field(() => CardType, { nullable: true })
  equals?: keyof typeof CardType;
  @Field(() => [CardType], { nullable: true })
  in?: Array<keyof typeof CardType>;
  @Field(() => [CardType], { nullable: true })
  notIn?: Array<keyof typeof CardType>;
  @Field(() => NestedEnumCardTypeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumCardTypeFilter>;
}

@InputType()
export class NestedEnumCardTypeWithAggregatesFilter {
  @Field(() => CardType, { nullable: true })
  equals?: keyof typeof CardType;
  @Field(() => [CardType], { nullable: true })
  in?: Array<keyof typeof CardType>;
  @Field(() => [CardType], { nullable: true })
  notIn?: Array<keyof typeof CardType>;
  @Field(() => NestedEnumCardTypeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumCardTypeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumCardTypeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumCardTypeFilter>;
  @Field(() => NestedEnumCardTypeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumCardTypeFilter>;
}

@InputType()
export class NestedEnumInvestmentStatusFilter {
  @Field(() => InvestmentStatus, { nullable: true })
  equals?: keyof typeof InvestmentStatus;
  @Field(() => [InvestmentStatus], { nullable: true })
  in?: Array<keyof typeof InvestmentStatus>;
  @Field(() => [InvestmentStatus], { nullable: true })
  notIn?: Array<keyof typeof InvestmentStatus>;
  @Field(() => NestedEnumInvestmentStatusFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumInvestmentStatusFilter>;
}

@InputType()
export class NestedEnumInvestmentStatusWithAggregatesFilter {
  @Field(() => InvestmentStatus, { nullable: true })
  equals?: keyof typeof InvestmentStatus;
  @Field(() => [InvestmentStatus], { nullable: true })
  in?: Array<keyof typeof InvestmentStatus>;
  @Field(() => [InvestmentStatus], { nullable: true })
  notIn?: Array<keyof typeof InvestmentStatus>;
  @Field(() => NestedEnumInvestmentStatusWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumInvestmentStatusWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumInvestmentStatusFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumInvestmentStatusFilter>;
  @Field(() => NestedEnumInvestmentStatusFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumInvestmentStatusFilter>;
}

@InputType()
export class NestedEnumInvestmentTransactionRoleFilter {
  @Field(() => InvestmentTransactionRole, { nullable: true })
  equals?: keyof typeof InvestmentTransactionRole;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  in?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  notIn?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => NestedEnumInvestmentTransactionRoleFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumInvestmentTransactionRoleFilter>;
}

@InputType()
export class NestedEnumInvestmentTransactionRoleWithAggregatesFilter {
  @Field(() => InvestmentTransactionRole, { nullable: true })
  equals?: keyof typeof InvestmentTransactionRole;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  in?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => [InvestmentTransactionRole], { nullable: true })
  notIn?: Array<keyof typeof InvestmentTransactionRole>;
  @Field(() => NestedEnumInvestmentTransactionRoleWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<
    typeof NestedEnumInvestmentTransactionRoleWithAggregatesFilter
  >;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumInvestmentTransactionRoleFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumInvestmentTransactionRoleFilter>;
  @Field(() => NestedEnumInvestmentTransactionRoleFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumInvestmentTransactionRoleFilter>;
}

@InputType()
export class NestedEnumPaymentMethodFilter {
  @Field(() => PaymentMethod, { nullable: true })
  equals?: keyof typeof PaymentMethod;
  @Field(() => [PaymentMethod], { nullable: true })
  in?: Array<keyof typeof PaymentMethod>;
  @Field(() => [PaymentMethod], { nullable: true })
  notIn?: Array<keyof typeof PaymentMethod>;
  @Field(() => NestedEnumPaymentMethodFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumPaymentMethodFilter>;
}

@InputType()
export class NestedEnumPaymentMethodWithAggregatesFilter {
  @Field(() => PaymentMethod, { nullable: true })
  equals?: keyof typeof PaymentMethod;
  @Field(() => [PaymentMethod], { nullable: true })
  in?: Array<keyof typeof PaymentMethod>;
  @Field(() => [PaymentMethod], { nullable: true })
  notIn?: Array<keyof typeof PaymentMethod>;
  @Field(() => NestedEnumPaymentMethodWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumPaymentMethodWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumPaymentMethodFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumPaymentMethodFilter>;
  @Field(() => NestedEnumPaymentMethodFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumPaymentMethodFilter>;
}

@InputType()
export class NestedEnumRegimeFilter {
  @Field(() => Regime, { nullable: true })
  equals?: keyof typeof Regime;
  @Field(() => [Regime], { nullable: true })
  in?: Array<keyof typeof Regime>;
  @Field(() => [Regime], { nullable: true })
  notIn?: Array<keyof typeof Regime>;
  @Field(() => NestedEnumRegimeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRegimeFilter>;
}

@InputType()
export class NestedEnumRegimeWithAggregatesFilter {
  @Field(() => Regime, { nullable: true })
  equals?: keyof typeof Regime;
  @Field(() => [Regime], { nullable: true })
  in?: Array<keyof typeof Regime>;
  @Field(() => [Regime], { nullable: true })
  notIn?: Array<keyof typeof Regime>;
  @Field(() => NestedEnumRegimeWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRegimeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumRegimeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumRegimeFilter>;
  @Field(() => NestedEnumRegimeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumRegimeFilter>;
}

@InputType()
export class NestedEnumRoleFilter {
  @Field(() => Role, { nullable: true })
  equals?: keyof typeof Role;
  @Field(() => [Role], { nullable: true })
  in?: Array<keyof typeof Role>;
  @Field(() => [Role], { nullable: true })
  notIn?: Array<keyof typeof Role>;
  @Field(() => NestedEnumRoleFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRoleFilter>;
}

@InputType()
export class NestedEnumRoleWithAggregatesFilter {
  @Field(() => Role, { nullable: true })
  equals?: keyof typeof Role;
  @Field(() => [Role], { nullable: true })
  in?: Array<keyof typeof Role>;
  @Field(() => [Role], { nullable: true })
  notIn?: Array<keyof typeof Role>;
  @Field(() => NestedEnumRoleWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumRoleWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumRoleFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumRoleFilter>;
  @Field(() => NestedEnumRoleFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumRoleFilter>;
}

@InputType()
export class NestedEnumTransactionStatusFilter {
  @Field(() => TransactionStatus, { nullable: true })
  equals?: keyof typeof TransactionStatus;
  @Field(() => [TransactionStatus], { nullable: true })
  in?: Array<keyof typeof TransactionStatus>;
  @Field(() => [TransactionStatus], { nullable: true })
  notIn?: Array<keyof typeof TransactionStatus>;
  @Field(() => NestedEnumTransactionStatusFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumTransactionStatusFilter>;
}

@InputType()
export class NestedEnumTransactionStatusWithAggregatesFilter {
  @Field(() => TransactionStatus, { nullable: true })
  equals?: keyof typeof TransactionStatus;
  @Field(() => [TransactionStatus], { nullable: true })
  in?: Array<keyof typeof TransactionStatus>;
  @Field(() => [TransactionStatus], { nullable: true })
  notIn?: Array<keyof typeof TransactionStatus>;
  @Field(() => NestedEnumTransactionStatusWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumTransactionStatusWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumTransactionStatusFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumTransactionStatusFilter>;
  @Field(() => NestedEnumTransactionStatusFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumTransactionStatusFilter>;
}

@InputType()
export class NestedEnumTransactionTypeFilter {
  @Field(() => TransactionType, { nullable: true })
  equals?: keyof typeof TransactionType;
  @Field(() => [TransactionType], { nullable: true })
  in?: Array<keyof typeof TransactionType>;
  @Field(() => [TransactionType], { nullable: true })
  notIn?: Array<keyof typeof TransactionType>;
  @Field(() => NestedEnumTransactionTypeFilter, { nullable: true })
  not?: InstanceType<typeof NestedEnumTransactionTypeFilter>;
}

@InputType()
export class NestedEnumTransactionTypeWithAggregatesFilter {
  @Field(() => TransactionType, { nullable: true })
  equals?: keyof typeof TransactionType;
  @Field(() => [TransactionType], { nullable: true })
  in?: Array<keyof typeof TransactionType>;
  @Field(() => [TransactionType], { nullable: true })
  notIn?: Array<keyof typeof TransactionType>;
  @Field(() => NestedEnumTransactionTypeWithAggregatesFilter, {
    nullable: true,
  })
  not?: InstanceType<typeof NestedEnumTransactionTypeWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedEnumTransactionTypeFilter, { nullable: true })
  _min?: InstanceType<typeof NestedEnumTransactionTypeFilter>;
  @Field(() => NestedEnumTransactionTypeFilter, { nullable: true })
  _max?: InstanceType<typeof NestedEnumTransactionTypeFilter>;
}

@InputType()
export class NestedFloatFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatFilter>;
}

@InputType()
export class NestedFloatNullableFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatNullableFilter>;
}

@InputType()
export class NestedFloatNullableWithAggregatesFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedFloatNullableFilter>;
}

@InputType()
export class NestedFloatWithAggregatesFilter {
  @Field(() => Float, { nullable: true })
  equals?: number;
  @Field(() => [Float], { nullable: true })
  in?: Array<number>;
  @Field(() => [Float], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Float, { nullable: true })
  lt?: number;
  @Field(() => Float, { nullable: true })
  lte?: number;
  @Field(() => Float, { nullable: true })
  gt?: number;
  @Field(() => Float, { nullable: true })
  gte?: number;
  @Field(() => NestedFloatWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedFloatWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _min?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _max?: InstanceType<typeof NestedFloatFilter>;
}

@InputType()
export class NestedIntFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;
  @Field(() => [Int], { nullable: true })
  in?: Array<number>;
  @Field(() => [Int], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Int, { nullable: true })
  lt?: number;
  @Field(() => Int, { nullable: true })
  lte?: number;
  @Field(() => Int, { nullable: true })
  gt?: number;
  @Field(() => Int, { nullable: true })
  gte?: number;
  @Field(() => NestedIntFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntFilter>;
}

@InputType()
export class NestedIntNullableFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;
  @Field(() => [Int], { nullable: true })
  in?: Array<number>;
  @Field(() => [Int], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Int, { nullable: true })
  lt?: number;
  @Field(() => Int, { nullable: true })
  lte?: number;
  @Field(() => Int, { nullable: true })
  gt?: number;
  @Field(() => Int, { nullable: true })
  gte?: number;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntNullableFilter>;
}

@InputType()
export class NestedIntNullableWithAggregatesFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;
  @Field(() => [Int], { nullable: true })
  in?: Array<number>;
  @Field(() => [Int], { nullable: true })
  notIn?: Array<number>;
  @Field(() => Int, { nullable: true })
  lt?: number;
  @Field(() => Int, { nullable: true })
  lte?: number;
  @Field(() => Int, { nullable: true })
  gt?: number;
  @Field(() => Int, { nullable: true })
  gte?: number;
  @Field(() => NestedIntNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedFloatNullableFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatNullableFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedIntNullableFilter>;
}

@InputType()
export class NestedStringFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => NestedStringFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringFilter>;
}

@InputType()
export class NestedStringNullableFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => NestedStringNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringNullableFilter>;
}

@InputType()
export class NestedStringNullableWithAggregatesFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => NestedStringNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedStringNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedStringNullableFilter>;
  @Field(() => NestedStringNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedStringNullableFilter>;
}

@InputType()
export class NestedStringWithAggregatesFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => NestedStringWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedStringFilter, { nullable: true })
  _min?: InstanceType<typeof NestedStringFilter>;
  @Field(() => NestedStringFilter, { nullable: true })
  _max?: InstanceType<typeof NestedStringFilter>;
}

@InputType()
export class NullableDateTimeFieldUpdateOperationsInput {
  @Field(() => Date, { nullable: true })
  set?: Date | string;
}

@InputType()
export class NullableDecimalFieldUpdateOperationsInput {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  set?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  increment?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  decrement?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  multiply?: Decimal;
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  divide?: Decimal;
}

@InputType()
export class NullableFloatFieldUpdateOperationsInput {
  @Field(() => Float, { nullable: true })
  set?: number;
  @Field(() => Float, { nullable: true })
  increment?: number;
  @Field(() => Float, { nullable: true })
  decrement?: number;
  @Field(() => Float, { nullable: true })
  multiply?: number;
  @Field(() => Float, { nullable: true })
  divide?: number;
}

@InputType()
export class NullableIntFieldUpdateOperationsInput {
  @Field(() => Int, { nullable: true })
  set?: number;
  @Field(() => Int, { nullable: true })
  increment?: number;
  @Field(() => Int, { nullable: true })
  decrement?: number;
  @Field(() => Int, { nullable: true })
  multiply?: number;
  @Field(() => Int, { nullable: true })
  divide?: number;
}

@InputType()
export class NullableStringFieldUpdateOperationsInput {
  @Field(() => String, { nullable: true })
  set?: string;
}

@InputType()
export class SortOrderInput {
  @Field(() => SortOrder, { nullable: false })
  sort!: keyof typeof SortOrder;
  @Field(() => NullsOrder, { nullable: true })
  nulls?: keyof typeof NullsOrder;
}

@InputType()
export class StringFieldUpdateOperationsInput {
  @Field(() => String, { nullable: true })
  set?: string;
}

@InputType()
export class StringFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => QueryMode, { nullable: true })
  mode?: keyof typeof QueryMode;
  @Field(() => NestedStringFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringFilter>;
}

@InputType()
export class StringNullableFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => QueryMode, { nullable: true })
  mode?: keyof typeof QueryMode;
  @Field(() => NestedStringNullableFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringNullableFilter>;
}

@InputType()
export class StringNullableWithAggregatesFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => QueryMode, { nullable: true })
  mode?: keyof typeof QueryMode;
  @Field(() => NestedStringNullableWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringNullableWithAggregatesFilter>;
  @Field(() => NestedIntNullableFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntNullableFilter>;
  @Field(() => NestedStringNullableFilter, { nullable: true })
  _min?: InstanceType<typeof NestedStringNullableFilter>;
  @Field(() => NestedStringNullableFilter, { nullable: true })
  _max?: InstanceType<typeof NestedStringNullableFilter>;
}

@InputType()
export class StringWithAggregatesFilter {
  @Field(() => String, { nullable: true })
  equals?: string;
  @Field(() => [String], { nullable: true })
  in?: Array<string>;
  @Field(() => [String], { nullable: true })
  notIn?: Array<string>;
  @Field(() => String, { nullable: true })
  lt?: string;
  @Field(() => String, { nullable: true })
  lte?: string;
  @Field(() => String, { nullable: true })
  gt?: string;
  @Field(() => String, { nullable: true })
  gte?: string;
  @Field(() => String, { nullable: true })
  contains?: string;
  @Field(() => String, { nullable: true })
  startsWith?: string;
  @Field(() => String, { nullable: true })
  endsWith?: string;
  @Field(() => QueryMode, { nullable: true })
  mode?: keyof typeof QueryMode;
  @Field(() => NestedStringWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedStringWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedStringFilter, { nullable: true })
  _min?: InstanceType<typeof NestedStringFilter>;
  @Field(() => NestedStringFilter, { nullable: true })
  _max?: InstanceType<typeof NestedStringFilter>;
}

@ObjectType()
export class AggregateTransaction {
  @Field(() => TransactionCountAggregate, { nullable: true })
  _count?: InstanceType<typeof TransactionCountAggregate>;
  @Field(() => TransactionAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof TransactionAvgAggregate>;
  @Field(() => TransactionSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof TransactionSumAggregate>;
  @Field(() => TransactionMinAggregate, { nullable: true })
  _min?: InstanceType<typeof TransactionMinAggregate>;
  @Field(() => TransactionMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof TransactionMaxAggregate>;
}

@ArgsType()
export class CreateManyTransactionArgs {
  @Field(() => [TransactionCreateManyInput], { nullable: false })
  @Type(() => TransactionCreateManyInput)
  data!: Array<TransactionCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneTransactionArgs {
  @Field(() => TransactionCreateInput, { nullable: false })
  @Type(() => TransactionCreateInput)
  data!: InstanceType<typeof TransactionCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyTransactionArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
}

@ArgsType()
export class DeleteOneTransactionArgs {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstTransactionOrThrowArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => [TransactionOrderByWithRelationInput], { nullable: true })
  @Type(() => TransactionOrderByWithRelationInput)
  orderBy?: Array<TransactionOrderByWithRelationInput>;
  @Field(() => TransactionWhereUniqueInput, { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [TransactionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof TransactionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstTransactionArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => [TransactionOrderByWithRelationInput], { nullable: true })
  @Type(() => TransactionOrderByWithRelationInput)
  orderBy?: Array<TransactionOrderByWithRelationInput>;
  @Field(() => TransactionWhereUniqueInput, { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [TransactionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof TransactionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyTransactionArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => [TransactionOrderByWithRelationInput], { nullable: true })
  @Type(() => TransactionOrderByWithRelationInput)
  orderBy?: Array<TransactionOrderByWithRelationInput>;
  @Field(() => TransactionWhereUniqueInput, { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [TransactionScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof TransactionScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueTransactionOrThrowArgs {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueTransactionArgs {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class TransactionAggregateArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => [TransactionOrderByWithRelationInput], { nullable: true })
  @Type(() => TransactionOrderByWithRelationInput)
  orderBy?: Array<TransactionOrderByWithRelationInput>;
  @Field(() => TransactionWhereUniqueInput, { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  cursor?: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => TransactionCountAggregateInput, { nullable: true })
  @Type(() => TransactionCountAggregateInput)
  _count?: InstanceType<typeof TransactionCountAggregateInput>;
  @Field(() => TransactionAvgAggregateInput, { nullable: true })
  @Type(() => TransactionAvgAggregateInput)
  _avg?: InstanceType<typeof TransactionAvgAggregateInput>;
  @Field(() => TransactionSumAggregateInput, { nullable: true })
  @Type(() => TransactionSumAggregateInput)
  _sum?: InstanceType<typeof TransactionSumAggregateInput>;
  @Field(() => TransactionMinAggregateInput, { nullable: true })
  @Type(() => TransactionMinAggregateInput)
  _min?: InstanceType<typeof TransactionMinAggregateInput>;
  @Field(() => TransactionMaxAggregateInput, { nullable: true })
  @Type(() => TransactionMaxAggregateInput)
  _max?: InstanceType<typeof TransactionMaxAggregateInput>;
}

@InputType()
export class TransactionAvgAggregateInput {
  @Field(() => Boolean, { nullable: true })
  amount?: true;
}

@ObjectType()
export class TransactionAvgAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
}

@InputType()
export class TransactionAvgOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
}

@InputType()
export class TransactionCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  description?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  date?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  paymentMethod?: true;
  @Field(() => Boolean, { nullable: true })
  sourceAccountId?: true;
  @Field(() => Boolean, { nullable: true })
  destinyAccountId?: true;
  @Field(() => Boolean, { nullable: true })
  cardBillingId?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class TransactionCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  description!: number;
  @Field(() => Int, { nullable: false })
  amount!: number;
  @Field(() => Int, { nullable: false })
  date!: number;
  @Field(() => Int, { nullable: false })
  status!: number;
  @Field(() => Int, { nullable: false })
  type!: number;
  @Field(() => Int, { nullable: false })
  paymentMethod!: number;
  @Field(() => Int, { nullable: false })
  sourceAccountId!: number;
  @Field(() => Int, { nullable: false })
  destinyAccountId!: number;
  @Field(() => Int, { nullable: false })
  cardBillingId!: number;
  @Field(() => Int, { nullable: false })
  userId!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class TransactionCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  date?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paymentMethod?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  sourceAccountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  destinyAccountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  cardBillingId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class TransactionCreateManyCardBillingInputEnvelope {
  @Field(() => [TransactionCreateManyCardBillingInput], { nullable: false })
  @Type(() => TransactionCreateManyCardBillingInput)
  data!: Array<TransactionCreateManyCardBillingInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class TransactionCreateManyCardBillingInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionCreateManyDestinyAccountInputEnvelope {
  @Field(() => [TransactionCreateManyDestinyAccountInput], { nullable: false })
  @Type(() => TransactionCreateManyDestinyAccountInput)
  data!: Array<TransactionCreateManyDestinyAccountInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class TransactionCreateManyDestinyAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionCreateManySourceAccountInputEnvelope {
  @Field(() => [TransactionCreateManySourceAccountInput], { nullable: false })
  @Type(() => TransactionCreateManySourceAccountInput)
  data!: Array<TransactionCreateManySourceAccountInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class TransactionCreateManySourceAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionCreateManyUserInputEnvelope {
  @Field(() => [TransactionCreateManyUserInput], { nullable: false })
  @Type(() => TransactionCreateManyUserInput)
  data!: Array<TransactionCreateManyUserInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@InputType()
export class TransactionCreateManyUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionCreateNestedManyWithoutCardBillingInput {
  @Field(() => [TransactionCreateWithoutCardBillingInput], { nullable: true })
  @Type(() => TransactionCreateWithoutCardBillingInput)
  create?: Array<TransactionCreateWithoutCardBillingInput>;
  @Field(() => [TransactionCreateOrConnectWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutCardBillingInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutCardBillingInput>;
  @Field(() => TransactionCreateManyCardBillingInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyCardBillingInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyCardBillingInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionCreateNestedManyWithoutDestinyAccountInput {
  @Field(() => [TransactionCreateWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateWithoutDestinyAccountInput)
  create?: Array<TransactionCreateWithoutDestinyAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutDestinyAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutDestinyAccountInput>;
  @Field(() => TransactionCreateManyDestinyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyDestinyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyDestinyAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionCreateNestedManyWithoutSourceAccountInput {
  @Field(() => [TransactionCreateWithoutSourceAccountInput], { nullable: true })
  @Type(() => TransactionCreateWithoutSourceAccountInput)
  create?: Array<TransactionCreateWithoutSourceAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutSourceAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutSourceAccountInput>;
  @Field(() => TransactionCreateManySourceAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManySourceAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManySourceAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionCreateNestedManyWithoutUserInput {
  @Field(() => [TransactionCreateWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateWithoutUserInput)
  create?: Array<TransactionCreateWithoutUserInput>;
  @Field(() => [TransactionCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutUserInput>;
  @Field(() => TransactionCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => TransactionCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof TransactionCreateManyUserInputEnvelope>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionCreateOrConnectWithoutCardBillingInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionCreateWithoutCardBillingInput, { nullable: false })
  @Type(() => TransactionCreateWithoutCardBillingInput)
  create!: InstanceType<typeof TransactionCreateWithoutCardBillingInput>;
}

@InputType()
export class TransactionCreateOrConnectWithoutDestinyAccountInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionCreateWithoutDestinyAccountInput, { nullable: false })
  @Type(() => TransactionCreateWithoutDestinyAccountInput)
  create!: InstanceType<typeof TransactionCreateWithoutDestinyAccountInput>;
}

@InputType()
export class TransactionCreateOrConnectWithoutSourceAccountInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionCreateWithoutSourceAccountInput, { nullable: false })
  @Type(() => TransactionCreateWithoutSourceAccountInput)
  create!: InstanceType<typeof TransactionCreateWithoutSourceAccountInput>;
}

@InputType()
export class TransactionCreateOrConnectWithoutUserInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionCreateWithoutUserInput, { nullable: false })
  @Type(() => TransactionCreateWithoutUserInput)
  create!: InstanceType<typeof TransactionCreateWithoutUserInput>;
}

@InputType()
export class TransactionCreateWithoutCardBillingInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutSourceTransactionsInput)
  sourceAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutSourceTransactionsInput
  >;
  @Field(() => AccountCreateNestedOneWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutDestinyTransactionsInput)
  destinyAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutDestinyTransactionsInput
  >;
  @Field(() => UserCreateNestedOneWithoutTransactionsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutTransactionsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutTransactionsInput>;
}

@InputType()
export class TransactionCreateWithoutDestinyAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutSourceTransactionsInput)
  sourceAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutSourceTransactionsInput
  >;
  @Field(() => CardBillingCreateNestedOneWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateNestedOneWithoutTransactionsInput)
  cardBilling?: InstanceType<
    typeof CardBillingCreateNestedOneWithoutTransactionsInput
  >;
  @Field(() => UserCreateNestedOneWithoutTransactionsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutTransactionsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutTransactionsInput>;
}

@InputType()
export class TransactionCreateWithoutSourceAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutDestinyTransactionsInput)
  destinyAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutDestinyTransactionsInput
  >;
  @Field(() => CardBillingCreateNestedOneWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateNestedOneWithoutTransactionsInput)
  cardBilling?: InstanceType<
    typeof CardBillingCreateNestedOneWithoutTransactionsInput
  >;
  @Field(() => UserCreateNestedOneWithoutTransactionsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutTransactionsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutTransactionsInput>;
}

@InputType()
export class TransactionCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutSourceTransactionsInput)
  sourceAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutSourceTransactionsInput
  >;
  @Field(() => AccountCreateNestedOneWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutDestinyTransactionsInput)
  destinyAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutDestinyTransactionsInput
  >;
  @Field(() => CardBillingCreateNestedOneWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateNestedOneWithoutTransactionsInput)
  cardBilling?: InstanceType<
    typeof CardBillingCreateNestedOneWithoutTransactionsInput
  >;
}

@InputType()
export class TransactionCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedOneWithoutSourceTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutSourceTransactionsInput)
  sourceAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutSourceTransactionsInput
  >;
  @Field(() => AccountCreateNestedOneWithoutDestinyTransactionsInput, {
    nullable: true,
  })
  @Type(() => AccountCreateNestedOneWithoutDestinyTransactionsInput)
  destinyAccount?: InstanceType<
    typeof AccountCreateNestedOneWithoutDestinyTransactionsInput
  >;
  @Field(() => CardBillingCreateNestedOneWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => CardBillingCreateNestedOneWithoutTransactionsInput)
  cardBilling?: InstanceType<
    typeof CardBillingCreateNestedOneWithoutTransactionsInput
  >;
  @Field(() => UserCreateNestedOneWithoutTransactionsInput, { nullable: false })
  @Type(() => UserCreateNestedOneWithoutTransactionsInput)
  user!: InstanceType<typeof UserCreateNestedOneWithoutTransactionsInput>;
}

@ArgsType()
export class TransactionGroupByArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => [TransactionOrderByWithAggregationInput], { nullable: true })
  @Type(() => TransactionOrderByWithAggregationInput)
  orderBy?: Array<TransactionOrderByWithAggregationInput>;
  @Field(() => [TransactionScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof TransactionScalarFieldEnum>;
  @Field(() => TransactionScalarWhereWithAggregatesInput, { nullable: true })
  @Type(() => TransactionScalarWhereWithAggregatesInput)
  having?: InstanceType<typeof TransactionScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => TransactionCountAggregateInput, { nullable: true })
  @Type(() => TransactionCountAggregateInput)
  _count?: InstanceType<typeof TransactionCountAggregateInput>;
  @Field(() => TransactionAvgAggregateInput, { nullable: true })
  @Type(() => TransactionAvgAggregateInput)
  _avg?: InstanceType<typeof TransactionAvgAggregateInput>;
  @Field(() => TransactionSumAggregateInput, { nullable: true })
  @Type(() => TransactionSumAggregateInput)
  _sum?: InstanceType<typeof TransactionSumAggregateInput>;
  @Field(() => TransactionMinAggregateInput, { nullable: true })
  @Type(() => TransactionMinAggregateInput)
  _min?: InstanceType<typeof TransactionMinAggregateInput>;
  @Field(() => TransactionMaxAggregateInput, { nullable: true })
  @Type(() => TransactionMaxAggregateInput)
  _max?: InstanceType<typeof TransactionMaxAggregateInput>;
}

@ObjectType()
export class TransactionGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => TransactionCountAggregate, { nullable: true })
  _count?: InstanceType<typeof TransactionCountAggregate>;
  @Field(() => TransactionAvgAggregate, { nullable: true })
  _avg?: InstanceType<typeof TransactionAvgAggregate>;
  @Field(() => TransactionSumAggregate, { nullable: true })
  _sum?: InstanceType<typeof TransactionSumAggregate>;
  @Field(() => TransactionMinAggregate, { nullable: true })
  _min?: InstanceType<typeof TransactionMinAggregate>;
  @Field(() => TransactionMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof TransactionMaxAggregate>;
}

@InputType()
export class TransactionListRelationFilter {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  every?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  some?: InstanceType<typeof TransactionWhereInput>;
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  none?: InstanceType<typeof TransactionWhereInput>;
}

@InputType()
export class TransactionMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  description?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  date?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  paymentMethod?: true;
  @Field(() => Boolean, { nullable: true })
  sourceAccountId?: true;
  @Field(() => Boolean, { nullable: true })
  destinyAccountId?: true;
  @Field(() => Boolean, { nullable: true })
  cardBillingId?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class TransactionMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
  @Field(() => Date, { nullable: true })
  date?: Date | string;
  @Field(() => TransactionStatus, { nullable: true })
  status?: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: true })
  type?: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: true })
  userId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  date?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paymentMethod?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  sourceAccountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  destinyAccountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  cardBillingId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class TransactionMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  description?: true;
  @Field(() => Boolean, { nullable: true })
  amount?: true;
  @Field(() => Boolean, { nullable: true })
  date?: true;
  @Field(() => Boolean, { nullable: true })
  status?: true;
  @Field(() => Boolean, { nullable: true })
  type?: true;
  @Field(() => Boolean, { nullable: true })
  paymentMethod?: true;
  @Field(() => Boolean, { nullable: true })
  sourceAccountId?: true;
  @Field(() => Boolean, { nullable: true })
  destinyAccountId?: true;
  @Field(() => Boolean, { nullable: true })
  cardBillingId?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class TransactionMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
  @Field(() => Date, { nullable: true })
  date?: Date | string;
  @Field(() => TransactionStatus, { nullable: true })
  status?: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: true })
  type?: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: true })
  userId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  date?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paymentMethod?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  sourceAccountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  destinyAccountId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  cardBillingId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class TransactionOrderByRelationAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  _count?: keyof typeof SortOrder;
}

@InputType()
export class TransactionOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  date?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paymentMethod?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  sourceAccountId?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  destinyAccountId?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  cardBillingId?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => TransactionCountOrderByAggregateInput, { nullable: true })
  @Type(() => TransactionCountOrderByAggregateInput)
  _count?: InstanceType<typeof TransactionCountOrderByAggregateInput>;
  @Field(() => TransactionAvgOrderByAggregateInput, { nullable: true })
  @Type(() => TransactionAvgOrderByAggregateInput)
  _avg?: InstanceType<typeof TransactionAvgOrderByAggregateInput>;
  @Field(() => TransactionMaxOrderByAggregateInput, { nullable: true })
  @Type(() => TransactionMaxOrderByAggregateInput)
  _max?: InstanceType<typeof TransactionMaxOrderByAggregateInput>;
  @Field(() => TransactionMinOrderByAggregateInput, { nullable: true })
  @Type(() => TransactionMinOrderByAggregateInput)
  _min?: InstanceType<typeof TransactionMinOrderByAggregateInput>;
  @Field(() => TransactionSumOrderByAggregateInput, { nullable: true })
  @Type(() => TransactionSumOrderByAggregateInput)
  _sum?: InstanceType<typeof TransactionSumOrderByAggregateInput>;
}

@InputType()
export class TransactionOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  date?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  status?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  paymentMethod?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  sourceAccountId?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  destinyAccountId?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrderInput, { nullable: true })
  cardBillingId?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  sourceAccount?: InstanceType<typeof AccountOrderByWithRelationInput>;
  @Field(() => AccountOrderByWithRelationInput, { nullable: true })
  @Type(() => AccountOrderByWithRelationInput)
  destinyAccount?: InstanceType<typeof AccountOrderByWithRelationInput>;
  @Field(() => CardBillingOrderByWithRelationInput, { nullable: true })
  @Type(() => CardBillingOrderByWithRelationInput)
  cardBilling?: InstanceType<typeof CardBillingOrderByWithRelationInput>;
  @Field(() => UserOrderByWithRelationInput, { nullable: true })
  @Type(() => UserOrderByWithRelationInput)
  user?: InstanceType<typeof UserOrderByWithRelationInput>;
}

@InputType()
export class TransactionScalarWhereWithAggregatesInput {
  @Field(() => [TransactionScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => TransactionScalarWhereWithAggregatesInput)
  AND?: Array<TransactionScalarWhereWithAggregatesInput>;
  @Field(() => [TransactionScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => TransactionScalarWhereWithAggregatesInput)
  OR?: Array<TransactionScalarWhereWithAggregatesInput>;
  @Field(() => [TransactionScalarWhereWithAggregatesInput], { nullable: true })
  @Type(() => TransactionScalarWhereWithAggregatesInput)
  NOT?: Array<TransactionScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  description?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DecimalWithAggregatesFilter, { nullable: true })
  @Type(() => DecimalWithAggregatesFilter)
  amount?: InstanceType<typeof DecimalWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  date?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => EnumTransactionStatusWithAggregatesFilter, { nullable: true })
  status?: InstanceType<typeof EnumTransactionStatusWithAggregatesFilter>;
  @Field(() => EnumTransactionTypeWithAggregatesFilter, { nullable: true })
  type?: InstanceType<typeof EnumTransactionTypeWithAggregatesFilter>;
  @Field(() => EnumPaymentMethodWithAggregatesFilter, { nullable: true })
  paymentMethod?: InstanceType<typeof EnumPaymentMethodWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  sourceAccountId?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  destinyAccountId?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => StringNullableWithAggregatesFilter, { nullable: true })
  cardBillingId?: InstanceType<typeof StringNullableWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  userId?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class TransactionScalarWhereInput {
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  AND?: Array<TransactionScalarWhereInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  OR?: Array<TransactionScalarWhereInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  NOT?: Array<TransactionScalarWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  description?: InstanceType<typeof StringFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  amount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  date?: InstanceType<typeof DateTimeFilter>;
  @Field(() => EnumTransactionStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumTransactionStatusFilter>;
  @Field(() => EnumTransactionTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumTransactionTypeFilter>;
  @Field(() => EnumPaymentMethodFilter, { nullable: true })
  paymentMethod?: InstanceType<typeof EnumPaymentMethodFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  sourceAccountId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  destinyAccountId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  cardBillingId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
}

@InputType()
export class TransactionSumAggregateInput {
  @Field(() => Boolean, { nullable: true })
  amount?: true;
}

@ObjectType()
export class TransactionSumAggregate {
  @Field(() => GraphQLDecimal, { nullable: true })
  amount?: Decimal;
}

@InputType()
export class TransactionSumOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
}

@InputType()
export class TransactionUncheckedCreateNestedManyWithoutCardBillingInput {
  @Field(() => [TransactionCreateWithoutCardBillingInput], { nullable: true })
  @Type(() => TransactionCreateWithoutCardBillingInput)
  create?: Array<TransactionCreateWithoutCardBillingInput>;
  @Field(() => [TransactionCreateOrConnectWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutCardBillingInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutCardBillingInput>;
  @Field(() => TransactionCreateManyCardBillingInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyCardBillingInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyCardBillingInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionUncheckedCreateNestedManyWithoutDestinyAccountInput {
  @Field(() => [TransactionCreateWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateWithoutDestinyAccountInput)
  create?: Array<TransactionCreateWithoutDestinyAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutDestinyAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutDestinyAccountInput>;
  @Field(() => TransactionCreateManyDestinyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyDestinyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyDestinyAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionUncheckedCreateNestedManyWithoutSourceAccountInput {
  @Field(() => [TransactionCreateWithoutSourceAccountInput], { nullable: true })
  @Type(() => TransactionCreateWithoutSourceAccountInput)
  create?: Array<TransactionCreateWithoutSourceAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutSourceAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutSourceAccountInput>;
  @Field(() => TransactionCreateManySourceAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManySourceAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManySourceAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionUncheckedCreateNestedManyWithoutUserInput {
  @Field(() => [TransactionCreateWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateWithoutUserInput)
  create?: Array<TransactionCreateWithoutUserInput>;
  @Field(() => [TransactionCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutUserInput>;
  @Field(() => TransactionCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => TransactionCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof TransactionCreateManyUserInputEnvelope>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
}

@InputType()
export class TransactionUncheckedCreateWithoutCardBillingInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionUncheckedCreateWithoutDestinyAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionUncheckedCreateWithoutSourceAccountInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionUncheckedCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  @Type(() => Object)
  @Transform(transformToDecimal)
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date | string;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId?: string;
  @Field(() => String, { nullable: true })
  destinyAccountId?: string;
  @Field(() => String, { nullable: true })
  cardBillingId?: string;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutCardBillingNestedInput {
  @Field(() => [TransactionCreateWithoutCardBillingInput], { nullable: true })
  @Type(() => TransactionCreateWithoutCardBillingInput)
  create?: Array<TransactionCreateWithoutCardBillingInput>;
  @Field(() => [TransactionCreateOrConnectWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutCardBillingInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutCardBillingInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutCardBillingInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutCardBillingInput>;
  @Field(() => TransactionCreateManyCardBillingInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyCardBillingInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyCardBillingInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutCardBillingInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutCardBillingInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutCardBillingInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutCardBillingInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutCardBillingInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutDestinyAccountNestedInput {
  @Field(() => [TransactionCreateWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateWithoutDestinyAccountInput)
  create?: Array<TransactionCreateWithoutDestinyAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutDestinyAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutDestinyAccountInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput>;
  @Field(() => TransactionCreateManyDestinyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyDestinyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyDestinyAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutDestinyAccountInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutDestinyAccountInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutDestinyAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutSourceAccountNestedInput {
  @Field(() => [TransactionCreateWithoutSourceAccountInput], { nullable: true })
  @Type(() => TransactionCreateWithoutSourceAccountInput)
  create?: Array<TransactionCreateWithoutSourceAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutSourceAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutSourceAccountInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutSourceAccountInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutSourceAccountInput>;
  @Field(() => TransactionCreateManySourceAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManySourceAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManySourceAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutSourceAccountInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutSourceAccountInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutSourceAccountInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutSourceAccountInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutSourceAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutUserNestedInput {
  @Field(() => [TransactionCreateWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateWithoutUserInput)
  create?: Array<TransactionCreateWithoutUserInput>;
  @Field(() => [TransactionCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutUserInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutUserInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutUserInput>;
  @Field(() => TransactionCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => TransactionCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof TransactionCreateManyUserInputEnvelope>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutUserInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutUserInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutUserInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutUserInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutUserInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateWithoutCardBillingInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateWithoutDestinyAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateWithoutSourceAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  sourceAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  destinyAccountId?: InstanceType<
    typeof NullableStringFieldUpdateOperationsInput
  >;
  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  cardBillingId?: InstanceType<typeof NullableStringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  userId?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class TransactionUpdateManyWithWhereWithoutCardBillingInput {
  @Field(() => TransactionScalarWhereInput, { nullable: false })
  @Type(() => TransactionScalarWhereInput)
  where!: InstanceType<typeof TransactionScalarWhereInput>;
  @Field(() => TransactionUpdateManyMutationInput, { nullable: false })
  @Type(() => TransactionUpdateManyMutationInput)
  data!: InstanceType<typeof TransactionUpdateManyMutationInput>;
}

@InputType()
export class TransactionUpdateManyWithWhereWithoutDestinyAccountInput {
  @Field(() => TransactionScalarWhereInput, { nullable: false })
  @Type(() => TransactionScalarWhereInput)
  where!: InstanceType<typeof TransactionScalarWhereInput>;
  @Field(() => TransactionUpdateManyMutationInput, { nullable: false })
  @Type(() => TransactionUpdateManyMutationInput)
  data!: InstanceType<typeof TransactionUpdateManyMutationInput>;
}

@InputType()
export class TransactionUpdateManyWithWhereWithoutSourceAccountInput {
  @Field(() => TransactionScalarWhereInput, { nullable: false })
  @Type(() => TransactionScalarWhereInput)
  where!: InstanceType<typeof TransactionScalarWhereInput>;
  @Field(() => TransactionUpdateManyMutationInput, { nullable: false })
  @Type(() => TransactionUpdateManyMutationInput)
  data!: InstanceType<typeof TransactionUpdateManyMutationInput>;
}

@InputType()
export class TransactionUpdateManyWithWhereWithoutUserInput {
  @Field(() => TransactionScalarWhereInput, { nullable: false })
  @Type(() => TransactionScalarWhereInput)
  where!: InstanceType<typeof TransactionScalarWhereInput>;
  @Field(() => TransactionUpdateManyMutationInput, { nullable: false })
  @Type(() => TransactionUpdateManyMutationInput)
  data!: InstanceType<typeof TransactionUpdateManyMutationInput>;
}

@InputType()
export class TransactionUpdateManyWithoutCardBillingNestedInput {
  @Field(() => [TransactionCreateWithoutCardBillingInput], { nullable: true })
  @Type(() => TransactionCreateWithoutCardBillingInput)
  create?: Array<TransactionCreateWithoutCardBillingInput>;
  @Field(() => [TransactionCreateOrConnectWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutCardBillingInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutCardBillingInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutCardBillingInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutCardBillingInput>;
  @Field(() => TransactionCreateManyCardBillingInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyCardBillingInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyCardBillingInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutCardBillingInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutCardBillingInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutCardBillingInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutCardBillingInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutCardBillingInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUpdateManyWithoutDestinyAccountNestedInput {
  @Field(() => [TransactionCreateWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateWithoutDestinyAccountInput)
  create?: Array<TransactionCreateWithoutDestinyAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutDestinyAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutDestinyAccountInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput>;
  @Field(() => TransactionCreateManyDestinyAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManyDestinyAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManyDestinyAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutDestinyAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutDestinyAccountInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutDestinyAccountInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUpdateManyWithoutSourceAccountNestedInput {
  @Field(() => [TransactionCreateWithoutSourceAccountInput], { nullable: true })
  @Type(() => TransactionCreateWithoutSourceAccountInput)
  create?: Array<TransactionCreateWithoutSourceAccountInput>;
  @Field(() => [TransactionCreateOrConnectWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionCreateOrConnectWithoutSourceAccountInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutSourceAccountInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutSourceAccountInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutSourceAccountInput>;
  @Field(() => TransactionCreateManySourceAccountInputEnvelope, {
    nullable: true,
  })
  @Type(() => TransactionCreateManySourceAccountInputEnvelope)
  createMany?: InstanceType<
    typeof TransactionCreateManySourceAccountInputEnvelope
  >;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutSourceAccountInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutSourceAccountInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutSourceAccountInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutSourceAccountInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutSourceAccountInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUpdateManyWithoutUserNestedInput {
  @Field(() => [TransactionCreateWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateWithoutUserInput)
  create?: Array<TransactionCreateWithoutUserInput>;
  @Field(() => [TransactionCreateOrConnectWithoutUserInput], { nullable: true })
  @Type(() => TransactionCreateOrConnectWithoutUserInput)
  connectOrCreate?: Array<TransactionCreateOrConnectWithoutUserInput>;
  @Field(() => [TransactionUpsertWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => TransactionUpsertWithWhereUniqueWithoutUserInput)
  upsert?: Array<TransactionUpsertWithWhereUniqueWithoutUserInput>;
  @Field(() => TransactionCreateManyUserInputEnvelope, { nullable: true })
  @Type(() => TransactionCreateManyUserInputEnvelope)
  createMany?: InstanceType<typeof TransactionCreateManyUserInputEnvelope>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  set?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  disconnect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  delete?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionWhereUniqueInput], { nullable: true })
  @Type(() => TransactionWhereUniqueInput)
  connect?: Array<Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>>;
  @Field(() => [TransactionUpdateWithWhereUniqueWithoutUserInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateWithWhereUniqueWithoutUserInput)
  update?: Array<TransactionUpdateWithWhereUniqueWithoutUserInput>;
  @Field(() => [TransactionUpdateManyWithWhereWithoutUserInput], {
    nullable: true,
  })
  @Type(() => TransactionUpdateManyWithWhereWithoutUserInput)
  updateMany?: Array<TransactionUpdateManyWithWhereWithoutUserInput>;
  @Field(() => [TransactionScalarWhereInput], { nullable: true })
  @Type(() => TransactionScalarWhereInput)
  deleteMany?: Array<TransactionScalarWhereInput>;
}

@InputType()
export class TransactionUpdateWithWhereUniqueWithoutCardBillingInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutCardBillingInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutCardBillingInput)
  data!: InstanceType<typeof TransactionUpdateWithoutCardBillingInput>;
}

@InputType()
export class TransactionUpdateWithWhereUniqueWithoutDestinyAccountInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutDestinyAccountInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutDestinyAccountInput)
  data!: InstanceType<typeof TransactionUpdateWithoutDestinyAccountInput>;
}

@InputType()
export class TransactionUpdateWithWhereUniqueWithoutSourceAccountInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutSourceAccountInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutSourceAccountInput)
  data!: InstanceType<typeof TransactionUpdateWithoutSourceAccountInput>;
}

@InputType()
export class TransactionUpdateWithWhereUniqueWithoutUserInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutUserInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutUserInput)
  data!: InstanceType<typeof TransactionUpdateWithoutUserInput>;
}

@InputType()
export class TransactionUpdateWithoutCardBillingInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneWithoutSourceTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutSourceTransactionsNestedInput)
  sourceAccount?: InstanceType<
    typeof AccountUpdateOneWithoutSourceTransactionsNestedInput
  >;
  @Field(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput)
  destinyAccount?: InstanceType<
    typeof AccountUpdateOneWithoutDestinyTransactionsNestedInput
  >;
  @Field(() => UserUpdateOneRequiredWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutTransactionsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutTransactionsNestedInput
  >;
}

@InputType()
export class TransactionUpdateWithoutDestinyAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneWithoutSourceTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutSourceTransactionsNestedInput)
  sourceAccount?: InstanceType<
    typeof AccountUpdateOneWithoutSourceTransactionsNestedInput
  >;
  @Field(() => CardBillingUpdateOneWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateOneWithoutTransactionsNestedInput)
  cardBilling?: InstanceType<
    typeof CardBillingUpdateOneWithoutTransactionsNestedInput
  >;
  @Field(() => UserUpdateOneRequiredWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutTransactionsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutTransactionsNestedInput
  >;
}

@InputType()
export class TransactionUpdateWithoutSourceAccountInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput)
  destinyAccount?: InstanceType<
    typeof AccountUpdateOneWithoutDestinyTransactionsNestedInput
  >;
  @Field(() => CardBillingUpdateOneWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateOneWithoutTransactionsNestedInput)
  cardBilling?: InstanceType<
    typeof CardBillingUpdateOneWithoutTransactionsNestedInput
  >;
  @Field(() => UserUpdateOneRequiredWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutTransactionsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutTransactionsNestedInput
  >;
}

@InputType()
export class TransactionUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneWithoutSourceTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutSourceTransactionsNestedInput)
  sourceAccount?: InstanceType<
    typeof AccountUpdateOneWithoutSourceTransactionsNestedInput
  >;
  @Field(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput)
  destinyAccount?: InstanceType<
    typeof AccountUpdateOneWithoutDestinyTransactionsNestedInput
  >;
  @Field(() => CardBillingUpdateOneWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateOneWithoutTransactionsNestedInput)
  cardBilling?: InstanceType<
    typeof CardBillingUpdateOneWithoutTransactionsNestedInput
  >;
}

@InputType()
export class TransactionUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  description?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => DecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => DecimalFieldUpdateOperationsInput)
  amount?: InstanceType<typeof DecimalFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  date?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: InstanceType<typeof EnumTransactionStatusFieldUpdateOperationsInput>;
  @Field(() => EnumTransactionTypeFieldUpdateOperationsInput, {
    nullable: true,
  })
  type?: InstanceType<typeof EnumTransactionTypeFieldUpdateOperationsInput>;
  @Field(() => EnumPaymentMethodFieldUpdateOperationsInput, { nullable: true })
  paymentMethod?: InstanceType<
    typeof EnumPaymentMethodFieldUpdateOperationsInput
  >;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateOneWithoutSourceTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutSourceTransactionsNestedInput)
  sourceAccount?: InstanceType<
    typeof AccountUpdateOneWithoutSourceTransactionsNestedInput
  >;
  @Field(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUpdateOneWithoutDestinyTransactionsNestedInput)
  destinyAccount?: InstanceType<
    typeof AccountUpdateOneWithoutDestinyTransactionsNestedInput
  >;
  @Field(() => CardBillingUpdateOneWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => CardBillingUpdateOneWithoutTransactionsNestedInput)
  cardBilling?: InstanceType<
    typeof CardBillingUpdateOneWithoutTransactionsNestedInput
  >;
  @Field(() => UserUpdateOneRequiredWithoutTransactionsNestedInput, {
    nullable: true,
  })
  @Type(() => UserUpdateOneRequiredWithoutTransactionsNestedInput)
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutTransactionsNestedInput
  >;
}

@InputType()
export class TransactionUpsertWithWhereUniqueWithoutCardBillingInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutCardBillingInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutCardBillingInput)
  update!: InstanceType<typeof TransactionUpdateWithoutCardBillingInput>;
  @Field(() => TransactionCreateWithoutCardBillingInput, { nullable: false })
  @Type(() => TransactionCreateWithoutCardBillingInput)
  create!: InstanceType<typeof TransactionCreateWithoutCardBillingInput>;
}

@InputType()
export class TransactionUpsertWithWhereUniqueWithoutDestinyAccountInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutDestinyAccountInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutDestinyAccountInput)
  update!: InstanceType<typeof TransactionUpdateWithoutDestinyAccountInput>;
  @Field(() => TransactionCreateWithoutDestinyAccountInput, { nullable: false })
  @Type(() => TransactionCreateWithoutDestinyAccountInput)
  create!: InstanceType<typeof TransactionCreateWithoutDestinyAccountInput>;
}

@InputType()
export class TransactionUpsertWithWhereUniqueWithoutSourceAccountInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutSourceAccountInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutSourceAccountInput)
  update!: InstanceType<typeof TransactionUpdateWithoutSourceAccountInput>;
  @Field(() => TransactionCreateWithoutSourceAccountInput, { nullable: false })
  @Type(() => TransactionCreateWithoutSourceAccountInput)
  create!: InstanceType<typeof TransactionCreateWithoutSourceAccountInput>;
}

@InputType()
export class TransactionUpsertWithWhereUniqueWithoutUserInput {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionUpdateWithoutUserInput, { nullable: false })
  @Type(() => TransactionUpdateWithoutUserInput)
  update!: InstanceType<typeof TransactionUpdateWithoutUserInput>;
  @Field(() => TransactionCreateWithoutUserInput, { nullable: false })
  @Type(() => TransactionCreateWithoutUserInput)
  create!: InstanceType<typeof TransactionCreateWithoutUserInput>;
}

@InputType()
export class TransactionWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => [TransactionWhereInput], { nullable: true })
  @Type(() => TransactionWhereInput)
  AND?: Array<TransactionWhereInput>;
  @Field(() => [TransactionWhereInput], { nullable: true })
  @Type(() => TransactionWhereInput)
  OR?: Array<TransactionWhereInput>;
  @Field(() => [TransactionWhereInput], { nullable: true })
  @Type(() => TransactionWhereInput)
  NOT?: Array<TransactionWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  description?: InstanceType<typeof StringFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  amount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  date?: InstanceType<typeof DateTimeFilter>;
  @Field(() => EnumTransactionStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumTransactionStatusFilter>;
  @Field(() => EnumTransactionTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumTransactionTypeFilter>;
  @Field(() => EnumPaymentMethodFilter, { nullable: true })
  paymentMethod?: InstanceType<typeof EnumPaymentMethodFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  sourceAccountId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  destinyAccountId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  cardBillingId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountNullableRelationFilter, { nullable: true })
  @Type(() => AccountNullableRelationFilter)
  sourceAccount?: InstanceType<typeof AccountNullableRelationFilter>;
  @Field(() => AccountNullableRelationFilter, { nullable: true })
  @Type(() => AccountNullableRelationFilter)
  destinyAccount?: InstanceType<typeof AccountNullableRelationFilter>;
  @Field(() => CardBillingNullableRelationFilter, { nullable: true })
  @Type(() => CardBillingNullableRelationFilter)
  cardBilling?: InstanceType<typeof CardBillingNullableRelationFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  @Type(() => UserRelationFilter)
  user?: InstanceType<typeof UserRelationFilter>;
}

@InputType()
export class TransactionWhereInput {
  @Field(() => [TransactionWhereInput], { nullable: true })
  @Type(() => TransactionWhereInput)
  AND?: Array<TransactionWhereInput>;
  @Field(() => [TransactionWhereInput], { nullable: true })
  @Type(() => TransactionWhereInput)
  OR?: Array<TransactionWhereInput>;
  @Field(() => [TransactionWhereInput], { nullable: true })
  @Type(() => TransactionWhereInput)
  NOT?: Array<TransactionWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  description?: InstanceType<typeof StringFilter>;
  @Field(() => DecimalFilter, { nullable: true })
  @Type(() => DecimalFilter)
  amount?: InstanceType<typeof DecimalFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  date?: InstanceType<typeof DateTimeFilter>;
  @Field(() => EnumTransactionStatusFilter, { nullable: true })
  status?: InstanceType<typeof EnumTransactionStatusFilter>;
  @Field(() => EnumTransactionTypeFilter, { nullable: true })
  type?: InstanceType<typeof EnumTransactionTypeFilter>;
  @Field(() => EnumPaymentMethodFilter, { nullable: true })
  paymentMethod?: InstanceType<typeof EnumPaymentMethodFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  sourceAccountId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  destinyAccountId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringNullableFilter, { nullable: true })
  cardBillingId?: InstanceType<typeof StringNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountNullableRelationFilter, { nullable: true })
  @Type(() => AccountNullableRelationFilter)
  sourceAccount?: InstanceType<typeof AccountNullableRelationFilter>;
  @Field(() => AccountNullableRelationFilter, { nullable: true })
  @Type(() => AccountNullableRelationFilter)
  destinyAccount?: InstanceType<typeof AccountNullableRelationFilter>;
  @Field(() => CardBillingNullableRelationFilter, { nullable: true })
  @Type(() => CardBillingNullableRelationFilter)
  cardBilling?: InstanceType<typeof CardBillingNullableRelationFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  @Type(() => UserRelationFilter)
  user?: InstanceType<typeof UserRelationFilter>;
}

@ObjectType()
export class Transaction {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  description!: string;
  @Field(() => GraphQLDecimal, { nullable: false })
  amount!: Decimal;
  @Field(() => Date, { nullable: false })
  date!: Date;
  @Field(() => TransactionStatus, { nullable: false })
  status!: keyof typeof TransactionStatus;
  @Field(() => TransactionType, { nullable: false })
  type!: keyof typeof TransactionType;
  @Field(() => PaymentMethod, { nullable: false })
  paymentMethod!: keyof typeof PaymentMethod;
  @Field(() => String, { nullable: true })
  sourceAccountId!: string | null;
  @Field(() => String, { nullable: true })
  destinyAccountId!: string | null;
  @Field(() => String, { nullable: true })
  cardBillingId!: string | null;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => Account, { nullable: true })
  sourceAccount?: InstanceType<typeof Account> | null;
  @Field(() => Account, { nullable: true })
  destinyAccount?: InstanceType<typeof Account> | null;
  @Field(() => CardBilling, { nullable: true })
  cardBilling?: InstanceType<typeof CardBilling> | null;
  @Field(() => User, { nullable: false })
  user?: InstanceType<typeof User>;
}

@ArgsType()
export class UpdateManyTransactionArgs {
  @Field(() => TransactionUpdateManyMutationInput, { nullable: false })
  @Type(() => TransactionUpdateManyMutationInput)
  data!: InstanceType<typeof TransactionUpdateManyMutationInput>;
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: InstanceType<typeof TransactionWhereInput>;
}

@ArgsType()
export class UpdateOneTransactionArgs {
  @Field(() => TransactionUpdateInput, { nullable: false })
  @Type(() => TransactionUpdateInput)
  data!: InstanceType<typeof TransactionUpdateInput>;
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneTransactionArgs {
  @Field(() => TransactionWhereUniqueInput, { nullable: false })
  @Type(() => TransactionWhereUniqueInput)
  where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
  @Field(() => TransactionCreateInput, { nullable: false })
  @Type(() => TransactionCreateInput)
  create!: InstanceType<typeof TransactionCreateInput>;
  @Field(() => TransactionUpdateInput, { nullable: false })
  @Type(() => TransactionUpdateInput)
  update!: InstanceType<typeof TransactionUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ObjectType()
export class AggregateUser {
  @Field(() => UserCountAggregate, { nullable: true })
  _count?: InstanceType<typeof UserCountAggregate>;
  @Field(() => UserMinAggregate, { nullable: true })
  _min?: InstanceType<typeof UserMinAggregate>;
  @Field(() => UserMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof UserMaxAggregate>;
}

@ArgsType()
export class CreateManyUserArgs {
  @Field(() => [UserCreateManyInput], { nullable: false })
  @Type(() => UserCreateManyInput)
  data!: Array<UserCreateManyInput>;
  @Field(() => Boolean, { nullable: true })
  skipDuplicates?: boolean;
}

@ArgsType()
export class CreateOneUserArgs {
  @Field(() => UserCreateInput, { nullable: false })
  @Type(() => UserCreateInput)
  data!: InstanceType<typeof UserCreateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class DeleteManyUserArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
}

@ArgsType()
export class DeleteOneUserArgs {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstUserOrThrowArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => [UserOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<UserOrderByWithRelationInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [UserScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof UserScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindFirstUserArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => [UserOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<UserOrderByWithRelationInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [UserScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof UserScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindManyUserArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => [UserOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<UserOrderByWithRelationInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => [UserScalarFieldEnum], { nullable: true })
  distinct?: Array<keyof typeof UserScalarFieldEnum>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueUserOrThrowArgs {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class FindUniqueUserArgs {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpdateManyUserArgs {
  @Field(() => UserUpdateManyMutationInput, { nullable: false })
  @Type(() => UserUpdateManyMutationInput)
  data!: InstanceType<typeof UserUpdateManyMutationInput>;
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
}

@ArgsType()
export class UpdateOneUserArgs {
  @Field(() => UserUpdateInput, { nullable: false })
  @Type(() => UserUpdateInput)
  data!: InstanceType<typeof UserUpdateInput>;
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UpsertOneUserArgs {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserCreateInput, { nullable: false })
  @Type(() => UserCreateInput)
  create!: InstanceType<typeof UserCreateInput>;
  @Field(() => UserUpdateInput, { nullable: false })
  @Type(() => UserUpdateInput)
  update!: InstanceType<typeof UserUpdateInput>;
  @Field(() => RelationLoadStrategy, { nullable: true })
  relationLoadStrategy?: keyof typeof RelationLoadStrategy;
}

@ArgsType()
export class UserAggregateArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => [UserOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<UserOrderByWithRelationInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => UserCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof UserCountAggregateInput>;
  @Field(() => UserMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof UserMinAggregateInput>;
  @Field(() => UserMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof UserMaxAggregateInput>;
}

@InputType()
export class UserCountAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  email?: true;
  @Field(() => Boolean, { nullable: true })
  password?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  role?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
  @Field(() => Boolean, { nullable: true })
  _all?: true;
}

@ObjectType()
export class UserCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  email!: number;
  @Field(() => Int, { nullable: false })
  password!: number;
  @Field(() => Int, { nullable: false })
  name!: number;
  @Field(() => Int, { nullable: false })
  role!: number;
  @Field(() => Int, { nullable: false })
  createdAt!: number;
  @Field(() => Int, { nullable: false })
  updatedAt!: number;
  @Field(() => Int, { nullable: false })
  _all!: number;
}

@InputType()
export class UserCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@ObjectType()
export class UserCount {
  @Field(() => Int, { nullable: false })
  accounts?: number;
  @Field(() => Int, { nullable: false })
  investments?: number;
  @Field(() => Int, { nullable: false })
  transactions?: number;
}

@InputType()
export class UserCreateManyInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class UserCreateNestedOneWithoutAccountsInput {
  @Field(() => UserCreateWithoutAccountsInput, { nullable: true })
  @Type(() => UserCreateWithoutAccountsInput)
  create?: InstanceType<typeof UserCreateWithoutAccountsInput>;
  @Field(() => UserCreateOrConnectWithoutAccountsInput, { nullable: true })
  @Type(() => UserCreateOrConnectWithoutAccountsInput)
  connectOrCreate?: InstanceType<
    typeof UserCreateOrConnectWithoutAccountsInput
  >;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
}

@InputType()
export class UserCreateNestedOneWithoutInvestmentsInput {
  @Field(() => UserCreateWithoutInvestmentsInput, { nullable: true })
  @Type(() => UserCreateWithoutInvestmentsInput)
  create?: InstanceType<typeof UserCreateWithoutInvestmentsInput>;
  @Field(() => UserCreateOrConnectWithoutInvestmentsInput, { nullable: true })
  @Type(() => UserCreateOrConnectWithoutInvestmentsInput)
  connectOrCreate?: InstanceType<
    typeof UserCreateOrConnectWithoutInvestmentsInput
  >;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
}

@InputType()
export class UserCreateNestedOneWithoutTransactionsInput {
  @Field(() => UserCreateWithoutTransactionsInput, { nullable: true })
  @Type(() => UserCreateWithoutTransactionsInput)
  create?: InstanceType<typeof UserCreateWithoutTransactionsInput>;
  @Field(() => UserCreateOrConnectWithoutTransactionsInput, { nullable: true })
  @Type(() => UserCreateOrConnectWithoutTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof UserCreateOrConnectWithoutTransactionsInput
  >;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
}

@InputType()
export class UserCreateOrConnectWithoutAccountsInput {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserCreateWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateWithoutAccountsInput)
  create!: InstanceType<typeof UserCreateWithoutAccountsInput>;
}

@InputType()
export class UserCreateOrConnectWithoutInvestmentsInput {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserCreateWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserCreateWithoutInvestmentsInput)
  create!: InstanceType<typeof UserCreateWithoutInvestmentsInput>;
}

@InputType()
export class UserCreateOrConnectWithoutTransactionsInput {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserCreateWithoutTransactionsInput, { nullable: false })
  @Type(() => UserCreateWithoutTransactionsInput)
  create!: InstanceType<typeof UserCreateWithoutTransactionsInput>;
}

@InputType()
export class UserCreateWithoutAccountsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => InvestmentCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => InvestmentCreateNestedManyWithoutUserInput)
  investments?: InstanceType<typeof InvestmentCreateNestedManyWithoutUserInput>;
  @Field(() => TransactionCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => TransactionCreateNestedManyWithoutUserInput)
  transactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutUserInput
  >;
}

@InputType()
export class UserCreateWithoutInvestmentsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => AccountCreateNestedManyWithoutUserInput)
  accounts?: InstanceType<typeof AccountCreateNestedManyWithoutUserInput>;
  @Field(() => TransactionCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => TransactionCreateNestedManyWithoutUserInput)
  transactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutUserInput
  >;
}

@InputType()
export class UserCreateWithoutTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => AccountCreateNestedManyWithoutUserInput)
  accounts?: InstanceType<typeof AccountCreateNestedManyWithoutUserInput>;
  @Field(() => InvestmentCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => InvestmentCreateNestedManyWithoutUserInput)
  investments?: InstanceType<typeof InvestmentCreateNestedManyWithoutUserInput>;
}

@InputType()
export class UserCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => AccountCreateNestedManyWithoutUserInput)
  accounts?: InstanceType<typeof AccountCreateNestedManyWithoutUserInput>;
  @Field(() => InvestmentCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => InvestmentCreateNestedManyWithoutUserInput)
  investments?: InstanceType<typeof InvestmentCreateNestedManyWithoutUserInput>;
  @Field(() => TransactionCreateNestedManyWithoutUserInput, { nullable: true })
  @Type(() => TransactionCreateNestedManyWithoutUserInput)
  transactions?: InstanceType<
    typeof TransactionCreateNestedManyWithoutUserInput
  >;
}

@ArgsType()
export class UserGroupByArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => [UserOrderByWithAggregationInput], { nullable: true })
  orderBy?: Array<UserOrderByWithAggregationInput>;
  @Field(() => [UserScalarFieldEnum], { nullable: false })
  by!: Array<keyof typeof UserScalarFieldEnum>;
  @Field(() => UserScalarWhereWithAggregatesInput, { nullable: true })
  having?: InstanceType<typeof UserScalarWhereWithAggregatesInput>;
  @Field(() => Int, { nullable: true })
  take?: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
  @Field(() => UserCountAggregateInput, { nullable: true })
  _count?: InstanceType<typeof UserCountAggregateInput>;
  @Field(() => UserMinAggregateInput, { nullable: true })
  _min?: InstanceType<typeof UserMinAggregateInput>;
  @Field(() => UserMaxAggregateInput, { nullable: true })
  _max?: InstanceType<typeof UserMaxAggregateInput>;
}

@ObjectType()
export class UserGroupBy {
  @Field(() => String, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;
  @Field(() => UserCountAggregate, { nullable: true })
  _count?: InstanceType<typeof UserCountAggregate>;
  @Field(() => UserMinAggregate, { nullable: true })
  _min?: InstanceType<typeof UserMinAggregate>;
  @Field(() => UserMaxAggregate, { nullable: true })
  _max?: InstanceType<typeof UserMaxAggregate>;
}

@InputType()
export class UserMaxAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  email?: true;
  @Field(() => Boolean, { nullable: true })
  password?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  role?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class UserMaxAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => String, { nullable: true })
  password?: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => Role, { nullable: true })
  role?: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class UserMaxOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class UserMinAggregateInput {
  @Field(() => Boolean, { nullable: true })
  id?: true;
  @Field(() => Boolean, { nullable: true })
  email?: true;
  @Field(() => Boolean, { nullable: true })
  password?: true;
  @Field(() => Boolean, { nullable: true })
  name?: true;
  @Field(() => Boolean, { nullable: true })
  role?: true;
  @Field(() => Boolean, { nullable: true })
  createdAt?: true;
  @Field(() => Boolean, { nullable: true })
  updatedAt?: true;
}

@ObjectType()
export class UserMinAggregate {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => String, { nullable: true })
  password?: string;
  @Field(() => String, { nullable: true })
  name?: string;
  @Field(() => Role, { nullable: true })
  role?: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class UserMinOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}

@InputType()
export class UserOrderByWithAggregationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => UserCountOrderByAggregateInput, { nullable: true })
  _count?: InstanceType<typeof UserCountOrderByAggregateInput>;
  @Field(() => UserMaxOrderByAggregateInput, { nullable: true })
  _max?: InstanceType<typeof UserMaxOrderByAggregateInput>;
  @Field(() => UserMinOrderByAggregateInput, { nullable: true })
  _min?: InstanceType<typeof UserMinOrderByAggregateInput>;
}

@InputType()
export class UserOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  role?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => AccountOrderByRelationAggregateInput, { nullable: true })
  @Type(() => AccountOrderByRelationAggregateInput)
  accounts?: InstanceType<typeof AccountOrderByRelationAggregateInput>;
  @Field(() => InvestmentOrderByRelationAggregateInput, { nullable: true })
  @Type(() => InvestmentOrderByRelationAggregateInput)
  investments?: InstanceType<typeof InvestmentOrderByRelationAggregateInput>;
  @Field(() => TransactionOrderByRelationAggregateInput, { nullable: true })
  @Type(() => TransactionOrderByRelationAggregateInput)
  transactions?: InstanceType<typeof TransactionOrderByRelationAggregateInput>;
}

@InputType()
export class UserRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  is?: InstanceType<typeof UserWhereInput>;
  @Field(() => UserWhereInput, { nullable: true })
  isNot?: InstanceType<typeof UserWhereInput>;
}

@InputType()
export class UserScalarWhereWithAggregatesInput {
  @Field(() => [UserScalarWhereWithAggregatesInput], { nullable: true })
  AND?: Array<UserScalarWhereWithAggregatesInput>;
  @Field(() => [UserScalarWhereWithAggregatesInput], { nullable: true })
  OR?: Array<UserScalarWhereWithAggregatesInput>;
  @Field(() => [UserScalarWhereWithAggregatesInput], { nullable: true })
  NOT?: Array<UserScalarWhereWithAggregatesInput>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  id?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  email?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  password?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  name?: InstanceType<typeof StringWithAggregatesFilter>;
  @Field(() => EnumRoleWithAggregatesFilter, { nullable: true })
  role?: InstanceType<typeof EnumRoleWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeWithAggregatesFilter>;
}

@InputType()
export class UserUncheckedCreateWithoutAccountsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutUserInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutUserInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutUserInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutUserInput
  >;
}

@InputType()
export class UserUncheckedCreateWithoutInvestmentsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedCreateNestedManyWithoutUserInput)
  accounts?: InstanceType<
    typeof AccountUncheckedCreateNestedManyWithoutUserInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutUserInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutUserInput
  >;
}

@InputType()
export class UserUncheckedCreateWithoutTransactionsInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedCreateNestedManyWithoutUserInput)
  accounts?: InstanceType<
    typeof AccountUncheckedCreateNestedManyWithoutUserInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutUserInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutUserInput
  >;
}

@InputType()
export class UserUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => AccountUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedCreateNestedManyWithoutUserInput)
  accounts?: InstanceType<
    typeof AccountUncheckedCreateNestedManyWithoutUserInput
  >;
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedCreateNestedManyWithoutUserInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutUserInput
  >;
  @Field(() => TransactionUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedCreateNestedManyWithoutUserInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedCreateNestedManyWithoutUserInput
  >;
}

@InputType()
export class UserUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class UserUncheckedUpdateWithoutAccountsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutUserNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutUserNestedInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUncheckedUpdateWithoutInvestmentsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedUpdateManyWithoutUserNestedInput)
  accounts?: InstanceType<
    typeof AccountUncheckedUpdateManyWithoutUserNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutUserNestedInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUncheckedUpdateWithoutTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedUpdateManyWithoutUserNestedInput)
  accounts?: InstanceType<
    typeof AccountUncheckedUpdateManyWithoutUserNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => AccountUncheckedUpdateManyWithoutUserNestedInput)
  accounts?: InstanceType<
    typeof AccountUncheckedUpdateManyWithoutUserNestedInput
  >;
  @Field(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput)
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutUserNestedInput
  >;
  @Field(() => TransactionUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  @Type(() => TransactionUncheckedUpdateManyWithoutUserNestedInput)
  transactions?: InstanceType<
    typeof TransactionUncheckedUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
}

@InputType()
export class UserUpdateOneRequiredWithoutAccountsNestedInput {
  @Field(() => UserCreateWithoutAccountsInput, { nullable: true })
  @Type(() => UserCreateWithoutAccountsInput)
  create?: InstanceType<typeof UserCreateWithoutAccountsInput>;
  @Field(() => UserCreateOrConnectWithoutAccountsInput, { nullable: true })
  @Type(() => UserCreateOrConnectWithoutAccountsInput)
  connectOrCreate?: InstanceType<
    typeof UserCreateOrConnectWithoutAccountsInput
  >;
  @Field(() => UserUpsertWithoutAccountsInput, { nullable: true })
  @Type(() => UserUpsertWithoutAccountsInput)
  upsert?: InstanceType<typeof UserUpsertWithoutAccountsInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserUpdateToOneWithWhereWithoutAccountsInput, { nullable: true })
  @Type(() => UserUpdateToOneWithWhereWithoutAccountsInput)
  update?: InstanceType<typeof UserUpdateToOneWithWhereWithoutAccountsInput>;
}

@InputType()
export class UserUpdateOneRequiredWithoutInvestmentsNestedInput {
  @Field(() => UserCreateWithoutInvestmentsInput, { nullable: true })
  @Type(() => UserCreateWithoutInvestmentsInput)
  create?: InstanceType<typeof UserCreateWithoutInvestmentsInput>;
  @Field(() => UserCreateOrConnectWithoutInvestmentsInput, { nullable: true })
  @Type(() => UserCreateOrConnectWithoutInvestmentsInput)
  connectOrCreate?: InstanceType<
    typeof UserCreateOrConnectWithoutInvestmentsInput
  >;
  @Field(() => UserUpsertWithoutInvestmentsInput, { nullable: true })
  @Type(() => UserUpsertWithoutInvestmentsInput)
  upsert?: InstanceType<typeof UserUpsertWithoutInvestmentsInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserUpdateToOneWithWhereWithoutInvestmentsInput, {
    nullable: true,
  })
  @Type(() => UserUpdateToOneWithWhereWithoutInvestmentsInput)
  update?: InstanceType<typeof UserUpdateToOneWithWhereWithoutInvestmentsInput>;
}

@InputType()
export class UserUpdateOneRequiredWithoutTransactionsNestedInput {
  @Field(() => UserCreateWithoutTransactionsInput, { nullable: true })
  @Type(() => UserCreateWithoutTransactionsInput)
  create?: InstanceType<typeof UserCreateWithoutTransactionsInput>;
  @Field(() => UserCreateOrConnectWithoutTransactionsInput, { nullable: true })
  @Type(() => UserCreateOrConnectWithoutTransactionsInput)
  connectOrCreate?: InstanceType<
    typeof UserCreateOrConnectWithoutTransactionsInput
  >;
  @Field(() => UserUpsertWithoutTransactionsInput, { nullable: true })
  @Type(() => UserUpsertWithoutTransactionsInput)
  upsert?: InstanceType<typeof UserUpsertWithoutTransactionsInput>;
  @Field(() => UserWhereUniqueInput, { nullable: true })
  @Type(() => UserWhereUniqueInput)
  connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserUpdateToOneWithWhereWithoutTransactionsInput, {
    nullable: true,
  })
  @Type(() => UserUpdateToOneWithWhereWithoutTransactionsInput)
  update?: InstanceType<
    typeof UserUpdateToOneWithWhereWithoutTransactionsInput
  >;
}

@InputType()
export class UserUpdateToOneWithWhereWithoutAccountsInput {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => UserUpdateWithoutAccountsInput, { nullable: false })
  @Type(() => UserUpdateWithoutAccountsInput)
  data!: InstanceType<typeof UserUpdateWithoutAccountsInput>;
}

@InputType()
export class UserUpdateToOneWithWhereWithoutInvestmentsInput {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => UserUpdateWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserUpdateWithoutInvestmentsInput)
  data!: InstanceType<typeof UserUpdateWithoutInvestmentsInput>;
}

@InputType()
export class UserUpdateToOneWithWhereWithoutTransactionsInput {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => UserUpdateWithoutTransactionsInput, { nullable: false })
  @Type(() => UserUpdateWithoutTransactionsInput)
  data!: InstanceType<typeof UserUpdateWithoutTransactionsInput>;
}

@InputType()
export class UserUpdateWithoutAccountsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => InvestmentUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => InvestmentUpdateManyWithoutUserNestedInput)
  investments?: InstanceType<typeof InvestmentUpdateManyWithoutUserNestedInput>;
  @Field(() => TransactionUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => TransactionUpdateManyWithoutUserNestedInput)
  transactions?: InstanceType<
    typeof TransactionUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUpdateWithoutInvestmentsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => AccountUpdateManyWithoutUserNestedInput)
  accounts?: InstanceType<typeof AccountUpdateManyWithoutUserNestedInput>;
  @Field(() => TransactionUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => TransactionUpdateManyWithoutUserNestedInput)
  transactions?: InstanceType<
    typeof TransactionUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUpdateWithoutTransactionsInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => AccountUpdateManyWithoutUserNestedInput)
  accounts?: InstanceType<typeof AccountUpdateManyWithoutUserNestedInput>;
  @Field(() => InvestmentUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => InvestmentUpdateManyWithoutUserNestedInput)
  investments?: InstanceType<typeof InvestmentUpdateManyWithoutUserNestedInput>;
}

@InputType()
export class UserUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => EnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: InstanceType<typeof EnumRoleFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => AccountUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => AccountUpdateManyWithoutUserNestedInput)
  accounts?: InstanceType<typeof AccountUpdateManyWithoutUserNestedInput>;
  @Field(() => InvestmentUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => InvestmentUpdateManyWithoutUserNestedInput)
  investments?: InstanceType<typeof InvestmentUpdateManyWithoutUserNestedInput>;
  @Field(() => TransactionUpdateManyWithoutUserNestedInput, { nullable: true })
  @Type(() => TransactionUpdateManyWithoutUserNestedInput)
  transactions?: InstanceType<
    typeof TransactionUpdateManyWithoutUserNestedInput
  >;
}

@InputType()
export class UserUpsertWithoutAccountsInput {
  @Field(() => UserUpdateWithoutAccountsInput, { nullable: false })
  @Type(() => UserUpdateWithoutAccountsInput)
  update!: InstanceType<typeof UserUpdateWithoutAccountsInput>;
  @Field(() => UserCreateWithoutAccountsInput, { nullable: false })
  @Type(() => UserCreateWithoutAccountsInput)
  create!: InstanceType<typeof UserCreateWithoutAccountsInput>;
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
}

@InputType()
export class UserUpsertWithoutInvestmentsInput {
  @Field(() => UserUpdateWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserUpdateWithoutInvestmentsInput)
  update!: InstanceType<typeof UserUpdateWithoutInvestmentsInput>;
  @Field(() => UserCreateWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserCreateWithoutInvestmentsInput)
  create!: InstanceType<typeof UserCreateWithoutInvestmentsInput>;
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
}

@InputType()
export class UserUpsertWithoutTransactionsInput {
  @Field(() => UserUpdateWithoutTransactionsInput, { nullable: false })
  @Type(() => UserUpdateWithoutTransactionsInput)
  update!: InstanceType<typeof UserUpdateWithoutTransactionsInput>;
  @Field(() => UserCreateWithoutTransactionsInput, { nullable: false })
  @Type(() => UserCreateWithoutTransactionsInput)
  create!: InstanceType<typeof UserCreateWithoutTransactionsInput>;
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
}

@InputType()
export class UserWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => [UserWhereInput], { nullable: true })
  AND?: Array<UserWhereInput>;
  @Field(() => [UserWhereInput], { nullable: true })
  OR?: Array<UserWhereInput>;
  @Field(() => [UserWhereInput], { nullable: true })
  NOT?: Array<UserWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  password?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => EnumRoleFilter, { nullable: true })
  role?: InstanceType<typeof EnumRoleFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountListRelationFilter, { nullable: true })
  @Type(() => AccountListRelationFilter)
  accounts?: InstanceType<typeof AccountListRelationFilter>;
  @Field(() => InvestmentListRelationFilter, { nullable: true })
  @Type(() => InvestmentListRelationFilter)
  investments?: InstanceType<typeof InvestmentListRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  transactions?: InstanceType<typeof TransactionListRelationFilter>;
}

@InputType()
export class UserWhereInput {
  @Field(() => [UserWhereInput], { nullable: true })
  AND?: Array<UserWhereInput>;
  @Field(() => [UserWhereInput], { nullable: true })
  OR?: Array<UserWhereInput>;
  @Field(() => [UserWhereInput], { nullable: true })
  NOT?: Array<UserWhereInput>;
  @Field(() => StringFilter, { nullable: true })
  id?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  email?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  password?: InstanceType<typeof StringFilter>;
  @Field(() => StringFilter, { nullable: true })
  name?: InstanceType<typeof StringFilter>;
  @Field(() => EnumRoleFilter, { nullable: true })
  role?: InstanceType<typeof EnumRoleFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => AccountListRelationFilter, { nullable: true })
  @Type(() => AccountListRelationFilter)
  accounts?: InstanceType<typeof AccountListRelationFilter>;
  @Field(() => InvestmentListRelationFilter, { nullable: true })
  @Type(() => InvestmentListRelationFilter)
  investments?: InstanceType<typeof InvestmentListRelationFilter>;
  @Field(() => TransactionListRelationFilter, { nullable: true })
  @Type(() => TransactionListRelationFilter)
  transactions?: InstanceType<typeof TransactionListRelationFilter>;
}

@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => String, { nullable: false })
  email!: string;
  @Field(() => String, { nullable: false })
  password!: string;
  @Field(() => String, { nullable: false })
  name!: string;
  @Field(() => Role, { nullable: false })
  role!: keyof typeof Role;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => [Account], { nullable: true })
  accounts?: Array<Account>;
  @Field(() => [Investment], { nullable: true })
  investments?: Array<Investment>;
  @Field(() => [Transaction], { nullable: true })
  transactions?: Array<Transaction>;
  @Field(() => UserCount, { nullable: false })
  _count?: InstanceType<typeof UserCount>;
}
