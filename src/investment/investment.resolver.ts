import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { InvestmentService } from './investment.service';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { UserModel } from '@/user/models/user.model';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import {
  InvestmentConnection,
  InvestmentModel,
  OrdenationInvestmentArgs,
} from './investment.model';
import { CurrentUser } from '@/user/user.decorator';
import { Auth } from '@/auth/auth.decorator';

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
}
