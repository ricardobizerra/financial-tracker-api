import { Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountConnection } from './account.model';
import { Args, ID } from '@nestjs/graphql';
import { Auth } from '@/auth/auth.decorator';
import { CardType } from '@/lib/graphql/prisma-client';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrdenationAccountArgs, AccountModel } from './account.model';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { CardService } from '@/card/card.service';
import { CreateAccountInput } from './create-account.input';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly cardService: CardService,
    private readonly prismaService: PrismaService,
  ) {}

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
  async findOne(
    @Args('id', { type: () => ID! }) id: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<AccountModel | null> {
    const queriedFields = getQueriedFields<AccountModel>(
      info,
      'account',
      false,
    );

    const account = await this.accountService.find({ id }, queriedFields);

    return {
      ...account,
      ...((!queriedFields?.length || queriedFields.includes('balance')) && {
        balance: this.accountService.calculateBalance(
          account.sourceTransactions,
          account.destinyTransactions,
          account.initialBalance,
        ),
      }),
    };
  }

  @Auth()
  @Mutation(() => AccountModel, { name: 'createAccount' })
  async create(
    @Args('data') data: CreateAccountInput,
    @CurrentUser() user: UserModel,
  ) {
    const createdAccount = await this.accountService.create({
      name: data.name,
      description: data.description,
      institutionConnection: {
        connect: {
          id: data.institutionConnectionId,
        },
      },
      initialBalance: data.initialBalance,
      isActive: data.isActive,
    });

    return createdAccount;
  }
}
