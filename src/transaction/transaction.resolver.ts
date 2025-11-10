import { Mutation, Query, Resolver, Args, Info } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionConnection, TransactionModel } from './transaction.model';
import { Auth } from '@/auth/auth.decorator';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrdenationTransactionArgs } from './transaction.model';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { TransactionFilterArgs } from './transaction.model';
import { TransactionCreateWithoutUserInput } from '@/lib/graphql/prisma-client';
import { TransactionType } from '@prisma/client';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Auth()
  @Mutation(() => TransactionModel, { name: 'createTransaction' })
  async createTransaction(
    @Args('data') data: TransactionCreateWithoutUserInput,
    @CurrentUser() user: UserModel,
  ) {
    if (data.type === TransactionType.INCOME && !data.destinyAccount) {
      throw new Error('Destiny account is mandatory for income transactions');
    }

    if (data.type === TransactionType.EXPENSE && !data.sourceAccount) {
      throw new Error('Source account is mandatory for expense transactions');
    }

    if (
      data.type === TransactionType.BETWEEN_ACCOUNTS &&
      !data.sourceAccount &&
      !data.destinyAccount
    ) {
      throw new Error(
        'Source and destiny accounts are mandatory for transactions between accounts',
      );
    }

    return this.transactionService.create({
      ...data,
      user: {
        connect: {
          id: user.id,
        },
      },
    });
  }

  @Auth()
  @Query(() => TransactionConnection, { name: 'transactions' })
  async findAllTransactions(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationTransactionArgs,
    @Args() filterArgs: TransactionFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<TransactionModel>(
      info,
      'transactions',
    );

    return this.transactionService.findMany({
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
      filterArgs,
    });
  }
}
