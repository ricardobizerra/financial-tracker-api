import {
  Args,
  Field,
  Float,
  ID,
  Info,
  Mutation,
  ObjectType,
  PickType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { InvestmentService } from './investment.service';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { UserModel } from '@/user/models/user.model';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import {
  InvestmentConnection,
  InvestmentModel,
  InvestmentRegimeSummary,
  InvestmentRegimeSummaryConnection,
  OrdenationInvestmentArgs,
  TotalInvestmentsModel,
} from './investment.model';
import { CurrentUser } from '@/user/user.decorator';
import { Auth } from '@/auth/auth.decorator';
import {
  Account,
  Investment,
  InvestmentCreateWithoutUserInput,
  Regime,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@/lib/graphql/prisma-client';
import { AccountService } from '@/account/account.service';
import { AccountType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateInvestmentInput } from './input/create-investment.input';
import { TransactionService } from '@/transaction/transaction.service';
import { Decimal } from '@prisma/client/runtime/library';

@Resolver(() => InvestmentModel)
export class InvestmentResolver {
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}

  @Auth()
  @Query(() => InvestmentConnection, { name: 'investments' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() ordenationArgs: OrdenationInvestmentArgs,
    @Args('regime', { type: () => Regime, nullable: true })
    regime: Regime | null,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<InvestmentModel>(
      info,
      'investments',
    );

    return this.investmentService.findMany({
      queriedFields,
      paginationArgs,
      ordenationArgs,
      userId: user?.id,
      regime,
    });
  }

  @Auth()
  @Mutation(() => Investment, { name: 'createInvestment' })
  async create(
    @Args('data') data: CreateInvestmentInput,
    @CurrentUser() user: UserModel,
  ) {
    const account = await this.accountService.find({
      id: data.destinyAccountId,
      user: {
        id: user?.id,
      },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    let sourceAccount: Account | null = null;
    let transaction: Transaction | null = null;

    if (account.type !== AccountType.INVESTMENT) {
      sourceAccount = await this.accountService.find({
        id: data.sourceAccountId,
        user: {
          id: user?.id,
        },
      });

      if (!sourceAccount) {
        throw new NotFoundException('Conta de origem não encontrada');
      }

      transaction = await this.transactionService.create({
        amount: new Decimal(data.amount),
        type: TransactionType.BETWEEN_ACCOUNTS,
        sourceAccount: {
          connect: {
            id: data.sourceAccountId,
          },
        },
        destinyAccount: {
          connect: {
            id: data.destinyAccountId,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
        date: data.startDate,
        description: `Investimento ${data.regimeName}`,
        status:
          data.startDate <= new Date()
            ? TransactionStatus.PLANNED
            : TransactionStatus.COMPLETED,
      });

      if (!transaction) {
        await this.transactionService.delete(transaction.id);
        throw new NotFoundException('Failed to create transaction');
      }
    }

    const createdInvestment = await this.investmentService.create(
      data,
      user?.id,
    );

    if (!createdInvestment) {
      if (transaction) {
        await this.transactionService.delete(transaction.id);
      }
      throw new NotFoundException('Failed to create investment');
    }

    return createdInvestment.investment;
  }

  @Auth()
  @Query(() => TotalInvestmentsModel, { name: 'totalInvestments' })
  async totalInvestments(
    @CurrentUser() user: UserModel,
    @Info() info: GraphQLResolveInfo,
  ) {
    const queriedFields = getQueriedFields<TotalInvestmentsModel>(
      info,
      'totalInvestments',
      false,
    );

    const totalInvestments = await this.investmentService.totalInvestments({
      userId: user?.id,
      queriedFields,
    });

    return totalInvestments;
  }

  @Auth()
  @Mutation(() => ID, { name: 'deleteInvestment' })
  async deleteInvestments(
    @Args('id', { type: () => ID! }) id: string,
    @CurrentUser() user: UserModel,
  ) {
    const deletedInvestment = await this.investmentService.delete(id, user?.id);

    return deletedInvestment.id;
  }

  @Auth()
  @Query(() => InvestmentRegimeSummaryConnection, { name: 'investmentRegimes' })
  async investmentRegimes(
    @CurrentUser() user: UserModel,
    @Info() info: GraphQLResolveInfo,
  ) {
    const queriedFields = getQueriedFields<InvestmentRegimeSummary>(
      info,
      'investmentRegimes',
    ) as (keyof InvestmentRegimeSummary)[];

    return this.investmentService.getInvestmentRegimes({
      userId: user?.id,
      queriedFields,
    });
  }
}
