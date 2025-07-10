import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { Int } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
  id = 'id',
  email = 'email',
  password = 'password',
  name = 'name',
  role = 'role',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
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

export enum Regime {
  CDI = 'CDI',
  POUPANCA = 'POUPANCA',
}

export enum QueryMode {
  'default' = 'default',
  insensitive = 'insensitive',
}

export enum NullsOrder {
  first = 'first',
  last = 'last',
}

export enum InvestmentScalarFieldEnum {
  id = 'id',
  amount = 'amount',
  startDate = 'startDate',
  duration = 'duration',
  regimeName = 'regimeName',
  regimePercentage = 'regimePercentage',
  userId = 'userId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

registerEnumType(InvestmentScalarFieldEnum, {
  name: 'InvestmentScalarFieldEnum',
  description: undefined,
});
registerEnumType(NullsOrder, { name: 'NullsOrder', description: undefined });
registerEnumType(QueryMode, { name: 'QueryMode', description: undefined });
registerEnumType(Regime, { name: 'Regime', description: undefined });
registerEnumType(Role, { name: 'Role', description: undefined });
registerEnumType(SortOrder, { name: 'SortOrder', description: undefined });
registerEnumType(TransactionIsolationLevel, {
  name: 'TransactionIsolationLevel',
  description: undefined,
});
registerEnumType(UserScalarFieldEnum, {
  name: 'UserScalarFieldEnum',
  description: undefined,
});

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
}

@ArgsType()
export class FindUniqueInvestmentOrThrowArgs {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
}

@ArgsType()
export class FindUniqueInvestmentArgs {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
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
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
}

@ObjectType()
export class InvestmentAvgAggregate {
  @Field(() => Float, { nullable: true })
  amount?: number;
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
  startDate?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimeName?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
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
export class InvestmentCountAggregate {
  @Field(() => Int, { nullable: false })
  id!: number;
  @Field(() => Int, { nullable: false })
  amount!: number;
  @Field(() => Int, { nullable: false })
  startDate!: number;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Int, { nullable: false })
  regimeName!: number;
  @Field(() => Int, { nullable: false })
  regimePercentage!: number;
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
export class InvestmentCountOrderByAggregateInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  amount?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
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
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
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
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
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
export class InvestmentCreateOrConnectWithoutUserInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentCreateWithoutUserInput, { nullable: false })
  @Type(() => InvestmentCreateWithoutUserInput)
  create!: InstanceType<typeof InvestmentCreateWithoutUserInput>;
}

@InputType()
export class InvestmentCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
  @Field(() => UserCreateNestedOneWithoutInvestmentsInput, { nullable: false })
  user!: InstanceType<typeof UserCreateNestedOneWithoutInvestmentsInput>;
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
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: false })
  userId!: string;
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
  startDate?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimeName?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
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
  @Field(() => Date, { nullable: true })
  startDate?: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Regime, { nullable: true })
  regimeName?: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: true })
  userId?: string;
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
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
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
  startDate?: true;
  @Field(() => Boolean, { nullable: true })
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimeName?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
  @Field(() => Boolean, { nullable: true })
  userId?: true;
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
  @Field(() => Date, { nullable: true })
  startDate?: Date | string;
  @Field(() => Int, { nullable: true })
  duration?: number;
  @Field(() => Regime, { nullable: true })
  regimeName?: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => String, { nullable: true })
  userId?: string;
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
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
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
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  regimePercentage?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
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
  @Field(() => SortOrder, { nullable: true })
  startDate?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimeName?: keyof typeof SortOrder;
  @Field(() => SortOrderInput, { nullable: true })
  regimePercentage?: InstanceType<typeof SortOrderInput>;
  @Field(() => SortOrder, { nullable: true })
  userId?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
  @Field(() => UserOrderByWithRelationInput, { nullable: true })
  user?: InstanceType<typeof UserOrderByWithRelationInput>;
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
  @Field(() => DateTimeWithAggregatesFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeWithAggregatesFilter>;
  @Field(() => IntWithAggregatesFilter, { nullable: true })
  duration?: InstanceType<typeof IntWithAggregatesFilter>;
  @Field(() => EnumRegimeWithAggregatesFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeWithAggregatesFilter>;
  @Field(() => FloatNullableWithAggregatesFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableWithAggregatesFilter>;
  @Field(() => StringWithAggregatesFilter, { nullable: true })
  userId?: InstanceType<typeof StringWithAggregatesFilter>;
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
  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFilter>;
  @Field(() => IntFilter, { nullable: true })
  duration?: InstanceType<typeof IntFilter>;
  @Field(() => EnumRegimeFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
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
  duration?: true;
  @Field(() => Boolean, { nullable: true })
  regimePercentage?: true;
}

@ObjectType()
export class InvestmentSumAggregate {
  @Field(() => Float, { nullable: true })
  amount?: number;
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
  duration?: keyof typeof SortOrder;
  @Field(() => SortOrder, { nullable: true })
  regimePercentage?: keyof typeof SortOrder;
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
export class InvestmentUncheckedCreateWithoutUserInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true })
  regimePercentage?: number;
  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}

@InputType()
export class InvestmentUncheckedCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date | string;
  @Field(() => Int, { nullable: false })
  duration!: number;
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
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
export class InvestmentUncheckedUpdateManyInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
export class InvestmentUncheckedUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
export class InvestmentUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
export class InvestmentUpdateManyMutationInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
export class InvestmentUpdateManyWithWhereWithoutUserInput {
  @Field(() => InvestmentScalarWhereInput, { nullable: false })
  @Type(() => InvestmentScalarWhereInput)
  where!: InstanceType<typeof InvestmentScalarWhereInput>;
  @Field(() => InvestmentUpdateManyMutationInput, { nullable: false })
  @Type(() => InvestmentUpdateManyMutationInput)
  data!: InstanceType<typeof InvestmentUpdateManyMutationInput>;
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
export class InvestmentUpdateWithWhereUniqueWithoutUserInput {
  @Field(() => InvestmentWhereUniqueInput, { nullable: false })
  @Type(() => InvestmentWhereUniqueInput)
  where!: Prisma.AtLeast<InvestmentWhereUniqueInput, 'id'>;
  @Field(() => InvestmentUpdateWithoutUserInput, { nullable: false })
  @Type(() => InvestmentUpdateWithoutUserInput)
  data!: InstanceType<typeof InvestmentUpdateWithoutUserInput>;
}

@InputType()
export class InvestmentUpdateWithoutUserInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
export class InvestmentUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: InstanceType<typeof StringFieldUpdateOperationsInput>;
  @Field(() => FloatFieldUpdateOperationsInput, { nullable: true })
  amount?: InstanceType<typeof FloatFieldUpdateOperationsInput>;
  @Field(() => DateTimeFieldUpdateOperationsInput, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFieldUpdateOperationsInput>;
  @Field(() => IntFieldUpdateOperationsInput, { nullable: true })
  duration?: InstanceType<typeof IntFieldUpdateOperationsInput>;
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
  user?: InstanceType<
    typeof UserUpdateOneRequiredWithoutInvestmentsNestedInput
  >;
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
  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFilter>;
  @Field(() => IntFilter, { nullable: true })
  duration?: InstanceType<typeof IntFilter>;
  @Field(() => EnumRegimeFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  user?: InstanceType<typeof UserRelationFilter>;
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
  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: InstanceType<typeof DateTimeFilter>;
  @Field(() => IntFilter, { nullable: true })
  duration?: InstanceType<typeof IntFilter>;
  @Field(() => EnumRegimeFilter, { nullable: true })
  regimeName?: InstanceType<typeof EnumRegimeFilter>;
  @Field(() => FloatNullableFilter, { nullable: true })
  regimePercentage?: InstanceType<typeof FloatNullableFilter>;
  @Field(() => StringFilter, { nullable: true })
  userId?: InstanceType<typeof StringFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: InstanceType<typeof DateTimeFilter>;
  @Field(() => UserRelationFilter, { nullable: true })
  user?: InstanceType<typeof UserRelationFilter>;
}

@ObjectType()
export class Investment {
  @Field(() => ID, { nullable: false })
  id!: string;
  @Field(() => Float, { nullable: false })
  amount!: number;
  @Field(() => Date, { nullable: false })
  startDate!: Date;
  @Field(() => Int, { nullable: false })
  duration!: number;
  @Field(() => Regime, { nullable: false })
  regimeName!: keyof typeof Regime;
  @Field(() => Float, { nullable: true, defaultValue: 100 })
  regimePercentage!: number | null;
  @Field(() => String, { nullable: false })
  userId!: string;
  @Field(() => Date, { nullable: false })
  createdAt!: Date;
  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
  @Field(() => User, { nullable: false })
  user?: InstanceType<typeof User>;
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
}

@ObjectType()
export class AffectedRows {
  @Field(() => Int, { nullable: false })
  count!: number;
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
export class IntFieldUpdateOperationsInput {
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
export class IntFilter {
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
export class IntWithAggregatesFilter {
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
  @Field(() => NestedIntWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _min?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _max?: InstanceType<typeof NestedIntFilter>;
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
export class NestedIntWithAggregatesFilter {
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
  @Field(() => NestedIntWithAggregatesFilter, { nullable: true })
  not?: InstanceType<typeof NestedIntWithAggregatesFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _count?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedFloatFilter, { nullable: true })
  _avg?: InstanceType<typeof NestedFloatFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _sum?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _min?: InstanceType<typeof NestedIntFilter>;
  @Field(() => NestedIntFilter, { nullable: true })
  _max?: InstanceType<typeof NestedIntFilter>;
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
}

@ArgsType()
export class FindUniqueUserOrThrowArgs {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
}

@ArgsType()
export class FindUniqueUserArgs {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
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
  investments?: number;
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
export class UserCreateOrConnectWithoutInvestmentsInput {
  @Field(() => UserWhereUniqueInput, { nullable: false })
  @Type(() => UserWhereUniqueInput)
  where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
  @Field(() => UserCreateWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserCreateWithoutInvestmentsInput)
  create!: InstanceType<typeof UserCreateWithoutInvestmentsInput>;
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
  @Field(() => InvestmentCreateNestedManyWithoutUserInput, { nullable: true })
  investments?: InstanceType<typeof InvestmentCreateNestedManyWithoutUserInput>;
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
  @Field(() => InvestmentOrderByRelationAggregateInput, { nullable: true })
  investments?: InstanceType<typeof InvestmentOrderByRelationAggregateInput>;
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
  @Field(() => InvestmentUncheckedCreateNestedManyWithoutUserInput, {
    nullable: true,
  })
  investments?: InstanceType<
    typeof InvestmentUncheckedCreateNestedManyWithoutUserInput
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
  @Field(() => InvestmentUncheckedUpdateManyWithoutUserNestedInput, {
    nullable: true,
  })
  investments?: InstanceType<
    typeof InvestmentUncheckedUpdateManyWithoutUserNestedInput
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
export class UserUpdateToOneWithWhereWithoutInvestmentsInput {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: InstanceType<typeof UserWhereInput>;
  @Field(() => UserUpdateWithoutInvestmentsInput, { nullable: false })
  @Type(() => UserUpdateWithoutInvestmentsInput)
  data!: InstanceType<typeof UserUpdateWithoutInvestmentsInput>;
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
  @Field(() => InvestmentUpdateManyWithoutUserNestedInput, { nullable: true })
  investments?: InstanceType<typeof InvestmentUpdateManyWithoutUserNestedInput>;
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
  @Field(() => InvestmentListRelationFilter, { nullable: true })
  investments?: InstanceType<typeof InvestmentListRelationFilter>;
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
  @Field(() => InvestmentListRelationFilter, { nullable: true })
  investments?: InstanceType<typeof InvestmentListRelationFilter>;
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
  @Field(() => [Investment], { nullable: true })
  investments?: Array<Investment>;
  @Field(() => UserCount, { nullable: false })
  _count?: InstanceType<typeof UserCount>;
}
