import { Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountConnection } from './account.model';
import { Args } from '@nestjs/graphql';
import { Auth } from '@/auth/auth.decorator';
import {
  AccountCreateInput,
  AccountCreateWithoutUserInput,
} from '@/lib/graphql/prisma-client';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrdenationAccountArgs, AccountModel } from './account.model';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Auth()
  @Query(() => AccountConnection, { name: 'accounts' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationAccountArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<AccountModel>(info, 'accounts');

    return this.accountService.findMany({
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
    });
  }

  @Auth()
  @Query(() => AccountModel, { name: 'account' })
  async findOne(@Args('id') id: string) {
    return this.accountService.find({ id });
  }

  @Auth()
  @Mutation(() => AccountModel, { name: 'createAccount' })
  async create(
    @Args('data') data: AccountCreateWithoutUserInput,
    @CurrentUser() user: UserModel,
  ) {
    const createdAccount = await this.accountService.create({
      ...data,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return createdAccount;
  }
}
