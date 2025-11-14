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
      id: data.accountId,
      type: {
        in: [AccountType.SAVINGS, AccountType.INVESTMENT],
      },
      user: {
        id: user.id,
      },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    if (
      account.type === AccountType.SAVINGS &&
      data.regimeName !== Regime.POUPANCA
    ) {
      throw new NotFoundException(
        'Investimento em poupança deve ser criado a partir de uma conta-poupança',
      );
    }

    if (
      account.type === AccountType.INVESTMENT &&
      data.regimeName === Regime.POUPANCA
    ) {
      throw new NotFoundException(
        'Investimento que não seja em poupança deve ser criado a partir de uma conta de investimento',
      );
    }

    const createdInvestment = await this.investmentService.create(
      data,
      user.id,
    );

    if (!createdInvestment) {
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
