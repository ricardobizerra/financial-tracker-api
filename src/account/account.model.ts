import { Account, AccountType } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { Connection } from '@/utils/models/connection.model';
import { Field, ObjectType, OmitType, ArgsType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform, Type } from 'class-transformer';
import {
  GraphQLDecimal,
  transformToDecimal,
} from 'prisma-graphql-type-decimal';

@ObjectType()
export class AccountModel extends OmitType(Account, [
  'user',
  'userId',
] as const) {
  @Field(() => GraphQLDecimal, { nullable: true })
  @Type(() => Object)
  @Transform(transformToDecimal)
  balance?: Decimal;
}

@ObjectType()
export class AccountConnection extends Connection(AccountModel) {}

@ArgsType()
export class OrdenationAccountArgs extends Ordenation(AccountModel, [
  'id',
  'description',
]) {}

@ArgsType()
export class AccountFilterArgs {
  @Field(() => AccountType, { nullable: true })
  type?: AccountType;
}
