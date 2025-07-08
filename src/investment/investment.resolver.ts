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
  OrdenationInvestmentArgs,
  TotalInvestmentsModel,
} from './investment.model';
import { CurrentUser } from '@/user/user.decorator';
import { Auth } from '@/auth/auth.decorator';
import {
  Investment,
  InvestmentCreateWithoutUserInput,
} from '@/lib/graphql/prisma-client';

@Resolver(() => InvestmentModel)
export class InvestmentResolver {
  constructor(private readonly investmentService: InvestmentService) {}

  @Auth()
  @Query(() => InvestmentConnection, { name: 'investments' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() ordenationArgs: OrdenationInvestmentArgs,
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
    });
  }

  @Auth()
  @Mutation(() => Investment, { name: 'createInvestment' })
  async create(
    @Args('data') data: InvestmentCreateWithoutUserInput,
    @CurrentUser() user: UserModel,
  ) {
    const createdInvestment = await this.investmentService.create(
      data,
      user?.id,
    );

    return createdInvestment;
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
  @Mutation(() => ID!, { name: 'deleteInvestment' })
  async deleteInvestments(
    @Args('id', { type: () => ID! }) id: string,
    @CurrentUser() user: UserModel,
  ) {
    const deletedInvestment = await this.investmentService.delete(id, user?.id);

    return deletedInvestment;
  }
}
