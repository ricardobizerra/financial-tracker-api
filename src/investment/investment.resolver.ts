import { Args, ID, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  AccountWithInvestmentCount,
} from './investment.model';
import { CurrentUser } from '@/user/user.decorator';
import { Auth } from '@/auth/auth.decorator';
import {
  Investment,
  Regime,
  InstitutionType,
} from '@/lib/graphql/prisma-client';
import { NotFoundException } from '@nestjs/common';
import { CreateInvestmentInput } from './input/create-investment.input';
import {
  InvestmentEvolutionModel,
  InvestmentEvolutionArgs,
} from './investment-evolution.model';
import { InstitutionConnectionService } from '@/institution-connection/institution-connection.service';

@Resolver(() => InvestmentModel)
export class InvestmentResolver {
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly institutionConnectionService: InstitutionConnectionService,
  ) {}

  @Auth()
  @Query(() => InvestmentConnection, { name: 'investments' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() ordenationArgs: OrdenationInvestmentArgs,
    @Args('regime', { type: () => Regime, nullable: true })
    regime: Regime | null,
    @Args('accountIds', { type: () => [String!], nullable: true })
    accountIds: string[] | null,
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
      accountIds,
    });
  }

  @Auth()
  @Mutation(() => Investment, { name: 'createInvestment' })
  async create(
    @Args('data') data: CreateInvestmentInput,
    @CurrentUser() user: UserModel,
  ) {
    const institutionConnection = await this.institutionConnectionService.find({
      id: data.institutionConnectionId,
      institution: {
        types: {
          has: InstitutionType.INVESTMENT,
        },
      },
      user: {
        id: user.id,
      },
    });

    if (!institutionConnection) {
      throw new NotFoundException('Conta não encontrada');
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
    @Args('institutionConnectionId', { type: () => String, nullable: true })
    institutionConnectionId: string | null,
  ) {
    const queriedFields = getQueriedFields<InvestmentRegimeSummary>(
      info,
      'investmentRegimes',
    ) as (keyof InvestmentRegimeSummary)[];

    return this.investmentService.getInvestmentRegimes({
      userId: user?.id,
      institutionConnectionId,
      queriedFields,
    });
  }

  @Auth()
  @Query(() => InvestmentEvolutionModel, { name: 'investmentEvolution' })
  async getInvestmentEvolution(
    @Args() args: InvestmentEvolutionArgs,
    @CurrentUser() user: UserModel,
  ) {
    return this.investmentService.getInvestmentEvolution({
      userId: user.id,
      accountId: args.accountId,
      period: args.period || 'YEAR',
    });
  }

  @Auth()
  @Query(() => [AccountWithInvestmentCount], {
    name: 'investmentAccounts',
  })
  async getAccountsWithInvestmentCount(
    @Args('regime', { type: () => Regime, nullable: false })
    regime: Regime,
    @CurrentUser() user: UserModel,
  ) {
    return this.investmentService.getAccountsWithInvestmentCount({
      userId: user.id,
      regime,
    });
  }
}
