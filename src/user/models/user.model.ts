import { User } from '@/lib/graphql/prisma-client';
import { Ordenation } from '@/utils/args/ordenation.args';
import { ArgsType, ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class UserModel extends PickType(User, [
  'id',
  'email',
  'name',
  'role',
]) {}

@ArgsType()
export class OrdenationUserArgs extends Ordenation(UserModel) {}
