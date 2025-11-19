import { Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountConnection, AccountFilterArgs } from './account.model';
import { Args } from '@nestjs/graphql';
import { Auth } from '@/auth/auth.decorator';
import {
  AccountCreateInput,
  AccountCreateWithoutUserInput,
  CardBillingStatus,
  CardType,
} from '@/lib/graphql/prisma-client';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrdenationAccountArgs, AccountModel } from './account.model';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { AccountType } from '@prisma/client';
import { PrismaService } from '@/lib/prisma/prisma.service';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly prismaService: PrismaService,
  ) {}

  @Auth()
  @Query(() => AccountConnection, { name: 'accounts' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationAccountArgs,
    @Args() filterArgs: AccountFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<AccountModel>(info, 'accounts');

    return this.accountService.findMany({
      filterArgs,
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

    if (data.type === AccountType.CREDIT_CARD) {
      const accountCard = await this.prismaService.accountCard.create({
        data: {
          type: CardType.CREDIT,
          billingCycleDay: 1,
          account: {
            connect: {
              id: createdAccount.id,
            },
          },
        },
      });

      if (!accountCard) {
        await this.accountService.delete(createdAccount.id);
        throw new Error('Account card not created');
      }

      const billing = await this.prismaService.cardBilling.create({
        data: {
          accountCard: {
            connect: {
              id: accountCard.id,
            },
          },
          periodStart: createdAccount.createdAt,
          periodEnd: undefined,
          status: CardBillingStatus.PENDING,
        },
      });

      if (!billing) {
        await this.accountService.delete(createdAccount.id);
        await this.prismaService.accountCard.delete({
          where: {
            accountId: accountCard.id,
          },
        });
        throw new Error('First card billing not created');
      }
    }

    return createdAccount;
  }
}
