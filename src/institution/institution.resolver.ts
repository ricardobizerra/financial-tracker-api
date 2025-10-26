import { Info, Query, Resolver } from '@nestjs/graphql';
import { InstitutionService } from './institution.service';
import { InstitutionConnection } from './institution.model';
import { Args } from '@nestjs/graphql';
import { Auth } from '@/auth/auth.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import {
  OrdenationInstitutionArgs,
  InstitutionModel,
} from './institution.model';

@Resolver()
export class InstitutionResolver {
  constructor(private readonly institutionService: InstitutionService) {}

  @Auth()
  @Query(() => InstitutionConnection, { name: 'institutions' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationInstitutionArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    const queriedFields = getQueriedFields<InstitutionModel>(
      info,
      'institutions',
    );

    return this.institutionService.findMany({
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
    });
  }

  @Auth()
  @Query(() => InstitutionModel, { name: 'institution' })
  async findOne(@Args('id') id: string) {
    return this.institutionService.find({ id });
  }
}
