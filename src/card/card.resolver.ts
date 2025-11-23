import { Resolver, Query, Args, Info, Mutation, ID } from '@nestjs/graphql';
import { CardService } from './card.service';
import {
  AccountCard,
  CardBilling,
  PaymentMethod,
  User,
} from '@/lib/graphql/prisma-client';
import { Auth } from '@/auth/auth.decorator';
import { CardBillingModel, CardBillingOnDate } from './card.model';
import { CurrentUser } from '@/user/user.decorator';
import { AccountService } from '@/account/account.service';
import { NotFoundException } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';

@Resolver(() => AccountCard)
export class CardResolver {
  constructor(
    private readonly cardService: CardService,
    private readonly accountService: AccountService,
  ) {}

  @Auth()
  @Query(() => AccountCard, { nullable: true })
  async accountCard(@Args('id') id: string): Promise<AccountCard> {
    return this.cardService.find({ id });
  }

  @Auth()
  @Query(() => CardBillingOnDate)
  async billing(
    @Info() info: GraphQLResolveInfo,
    @Args('accountId', { type: () => ID! }) accountId: string,
    @CurrentUser() user: User,
    @Args('id', { type: () => ID, nullable: true }) id?: string,
  ): Promise<CardBillingOnDate> {
    const queriedFields = getQueriedFields<CardBillingOnDate>(
      info,
      'billing',
      false,
    );

    const account = await this.accountService.find({
      id: accountId,
      user: { id: user.id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.cardService.findCurrentBilling(
      queriedFields,
      accountId,
      user.id,
      id,
    );
  }

  @Auth()
  @Mutation(() => CardBilling)
  async closeBilling(
    @CurrentUser() user: User,
    @Args('billingId') billingId: string,
  ): Promise<CardBilling> {
    return this.cardService.closeBilling({
      billingId,
      userId: user.id,
    });
  }
}
