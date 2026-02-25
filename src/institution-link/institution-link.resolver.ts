import { Resolver, Query, Args, Info } from '@nestjs/graphql';
import { Auth } from '@/auth/auth.decorator';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { InstitutionLinkService } from './institution-link.service';
import {
  InstitutionLinkConnection,
  InstitutionLinkFilterArgs,
  OrdenationInstitutionLinkArgs,
  InstitutionLinkModel,
} from './institution-link.model';

@Resolver(() => InstitutionLinkModel)
export class InstitutionLinkResolver {
  constructor(
    private readonly institutionLinkService: InstitutionLinkService,
  ) {}

  @Auth()
  @Query(() => InstitutionLinkConnection, {
    name: 'institutionLinks',
  })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationInstitutionLinkArgs,
    @Args() filterArgs: InstitutionLinkFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<InstitutionLinkModel>(
      info,
      'institutionLinks',
    );

    return this.institutionLinkService.findMany({
      filterArgs,
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
    });
  }
}
