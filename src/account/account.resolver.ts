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

    // if (data.type === AccountType.CREDIT_CARD) {
    //   if (!data.cardInfos) {
    //     throw new Error('Card infos are required');
    //   }

    //   const isDebitCard = data.cardInfos.type === CardType.DEBIT;

    //   // Validar campos de fatura apenas para cartões de crédito
    //   if (!isDebitCard) {
    //     if (!data.cardInfos.billingCycleDay) {
    //       throw new Error('Billing cycle day is required for credit cards');
    //     }
    //     if (!data.cardInfos.billingPaymentDay) {
    //       throw new Error('Billing payment day is required for credit cards');
    //     }
    //     if (!data.cardInfos.defaultLimit) {
    //       throw new Error('Default limit is required for credit cards');
    //     }
    //   }

    //   const accountCard = await this.prismaService.accountCard.create({
    //     data: {
    //       type: data.cardInfos.type,
    //       billingCycleDay: data.cardInfos.billingCycleDay ?? 1,
    //       billingPaymentDay: data.cardInfos.billingPaymentDay ?? 1,
    //       account: {
    //         connect: {
    //           id: createdAccount.id,
    //         },
    //       },
    //       defaultLimit: data.cardInfos.defaultLimit ?? 0,
    //     },
    //   });

    //   if (!accountCard) {
    //     await this.accountService.delete(createdAccount.id);
    //     throw new Error('Account card not created');
    //   }

    //   // Cartões de débito não usam billing/fatura
    //   if (!isDebitCard) {
    //     const billing = await this.cardService.createBilling({
    //       cardId: accountCard.id,
    //       cardBillingCycleDay: data.cardInfos.billingCycleDay,
    //       cardBillingPaymentDay: data.cardInfos.billingPaymentDay,
    //       periodStart: createdAccount.createdAt,
    //       limit: accountCard.defaultLimit,
    //     });

    //     if (!billing) {
    //       await this.accountService.delete(createdAccount.id);
    //       await this.prismaService.accountCard.delete({
    //         where: {
    //           accountId: accountCard.id,
    //         },
    //       });
    //       throw new Error('First card billing not created');
    //     }
    //   }
    // }

    return createdAccount;
  }
}
