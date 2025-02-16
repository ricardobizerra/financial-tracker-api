import { Investment } from '@/lib/graphql/prisma-client';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { InvestmentService } from './investment.service';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { OrdenationUserArgs } from '@/user/models/user.model';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import {
  InvestmentConnection,
  InvestmentModel,
  OrdenationInvestmentArgs,
} from './investment.model';

@Resolver(() => InvestmentModel)
export class InvestmentResolver {
  constructor(private readonly investmentService: InvestmentService) {}

  @Query(() => InvestmentConnection, { name: 'investments' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() ordenationArgs: OrdenationInvestmentArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    const queriedFields = getQueriedFields<InvestmentModel>(
      info,
      'investments',
    );

    return this.investmentService.findMany({
      queriedFields,
      paginationArgs,
      ordenationArgs,
    });
  }
}
