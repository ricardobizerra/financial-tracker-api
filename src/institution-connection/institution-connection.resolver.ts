import { Resolver, Query, Args, Info } from '@nestjs/graphql';
import { Auth } from '@/auth/auth.decorator';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { InstitutionConnectionService } from './institution-connection.service';
import {
  InstitutionConnectionConnection,
  InstitutionConnectionFilterArgs,
  OrdenationInstitutionConnectionArgs,
  InstitutionConnectionModel,
} from './institution-connection.model';

@Resolver(() => InstitutionConnectionModel)
export class InstitutionConnectionResolver {
  constructor(
    private readonly institutionConnectionService: InstitutionConnectionService,
  ) {}

  @Auth()
  @Query(() => InstitutionConnectionConnection, {
    name: 'institutionConnections',
  })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationInstitutionConnectionArgs,
    @Args() filterArgs: InstitutionConnectionFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<InstitutionConnectionModel>(
      info,
      'institutionConnections',
    );

    return this.institutionConnectionService.findMany({
      filterArgs,
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
    });
  }
}
