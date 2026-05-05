import {
  Mutation,
  Query,
  Resolver,
  Args,
  Info,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RecurringTransactionService } from './recurring-transaction.service';
import {
  RecurringTransactionConnection,
  RecurringTransactionModel,
  OrdenationRecurringTransactionArgs,
  RecurringTransactionFilterArgs,
  RecurringTransactionSuggestion,
} from './recurring-transaction.model';
import { Auth } from '@/auth/auth.decorator';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { CreateRecurringTransactionInput } from './input/create-recurring-transaction.input';
import { UpdateRecurringTransactionInput } from './input/update-recurring-transaction.input';
import { TransactionModel } from '@/transaction/transaction.model';

@Resolver(() => RecurringTransactionModel)
export class RecurringTransactionResolver {
  constructor(
    private readonly recurringTransactionService: RecurringTransactionService,
  ) {}

  @ResolveField(() => [TransactionModel])
  async transactions(
    @Parent() recurring: RecurringTransactionModel,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.findTransactionsByRecurrence(
      recurring.id,
      user.id,
    );
  }

  @Auth()
  @Mutation(() => RecurringTransactionModel, {
    name: 'createRecurringTransaction',
  })
  async createRecurringTransaction(
    @Args('data') data: CreateRecurringTransactionInput,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.createWithTransactions(
      data,
      user.id,
    );
  }

  @Auth()
  @Mutation(() => RecurringTransactionModel, {
    name: 'updateRecurringTransactionFromDate',
  })
  async updateRecurringTransactionFromDate(
    @Args('id') id: string,
    @Args('fromDate') fromDate: Date,
    @Args('data') data: UpdateRecurringTransactionInput,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.updateFromDate(
      id,
      fromDate,
      data,
      user.id,
    );
  }

  @Auth()
  @Mutation(() => RecurringTransactionModel, {
    name: 'pauseRecurringTransaction',
  })
  async pauseRecurringTransaction(
    @Args('id') id: string,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.pause(id, user.id);
  }

  @Auth()
  @Mutation(() => RecurringTransactionModel, {
    name: 'resumeRecurringTransaction',
  })
  async resumeRecurringTransaction(
    @Args('id') id: string,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.resume(id, user.id);
  }

  @Auth()
  @Mutation(() => RecurringTransactionModel, {
    name: 'endRecurringTransaction',
  })
  async endRecurringTransaction(
    @Args('id') id: string,
    @Args('endDate') endDate: Date,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.endRecurrence(id, endDate, user.id);
  }

  @Auth()
  @Mutation(() => RecurringTransactionModel, {
    name: 'deleteRecurringTransaction',
  })
  async deleteRecurringTransaction(
    @Args('id') id: string,
    @Args('deleteAllTransactions', { type: () => Boolean, defaultValue: false })
    deleteAllTransactions: boolean,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.delete(
      id,
      user.id,
      deleteAllTransactions,
    );
  }

  @Auth()
  @Query(() => RecurringTransactionModel, {
    name: 'recurringTransaction',
    nullable: true,
  })
  async findRecurringTransaction(
    @Args('id') id: string,
    @CurrentUser() user: UserModel,
  ) {
    return this.recurringTransactionService.findById(id, user.id);
  }

  @Auth()
  @Query(() => RecurringTransactionConnection, {
    name: 'recurringTransactions',
  })
  async findAllRecurringTransactions(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationRecurringTransactionArgs,
    @Args() filterArgs: RecurringTransactionFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<RecurringTransactionModel>(
      info,
      'recurringTransactions',
    );

    return this.recurringTransactionService.findMany({
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
      filterArgs,
    });
  }

  @Auth()
  @Query(() => [RecurringTransactionSuggestion], {
    name: 'possibleRecurringTransactions',
  })
  async possibleRecurringTransactions(@CurrentUser() user: UserModel) {
    return this.recurringTransactionService.findSuggestions(user.id);
  }

  @Auth()
  @Mutation(() => Boolean, { name: 'ignorePossibleRecurrence' })
  async ignorePossibleRecurrence(
    @Args('description') description: string,
    @CurrentUser() user: UserModel,
  ) {
    await this.recurringTransactionService.ignoreSuggestion(
      user.id,
      description,
    );
    return true;
  }
}
