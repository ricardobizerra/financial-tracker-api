import { Resolver, Query, Args, Info, Mutation, ID } from '@nestjs/graphql';
import { CardService } from './card.service';
import { Card, CardBilling, CardType, User } from '@/lib/graphql/prisma-client';
import { Auth } from '@/auth/auth.decorator';
import {
  CardBillingOnDate,
  CardConnection,
  CardFilterArgs,
  OrdenationCardArgs,
} from './card.model';
import { CurrentUser } from '@/user/user.decorator';
import { AccountService } from '@/account/account.service';
import { NotFoundException } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionModel } from '@/transaction/transaction.model';
import { CreateCardInput } from './create-card.input';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { UserModel } from '@/user/models/user.model';

@Resolver(() => Card)
export class CardResolver {
  constructor(
    private readonly cardService: CardService,
    private readonly accountService: AccountService,
  ) {}

  @Auth()
  @Query(() => Card, { name: 'card', nullable: true })
  async card(
    @Info() info: GraphQLResolveInfo,
    @Args('id', { type: () => ID! }) id: string,
  ): Promise<Card> {
    const queriedFields = getQueriedFields<Card>(info, 'card', false);
    return this.cardService.find({ id }, queriedFields);
  }

  @Auth()
  @Query(() => CardConnection, { name: 'cards' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationCardArgs,
    @Args() filterArgs: CardFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<Card>(info, 'cards');

    return this.cardService.findMany({
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
      filterArgs,
    });
  }

  @Auth()
  @Query(() => CardBillingOnDate)
  async billing(
    @Info() info: GraphQLResolveInfo,
    @Args('cardId', { type: () => ID! }) cardId: string,
    @CurrentUser() user: User,
    @Args('id', { type: () => ID, nullable: true }) id?: string,
  ): Promise<CardBillingOnDate> {
    const queriedFields = getQueriedFields<CardBillingOnDate>(
      info,
      'billing',
      false,
    );

    const card = await this.cardService.find({
      id: cardId,
      institutionLink: { userId: user.id },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.cardService.findCurrentBilling(
      queriedFields,
      cardId,
      user.id,
      id,
    );
  }

  @Auth()
  @Query(() => [TransactionModel])
  async billingTransactions(
    @Args('billingId', { type: () => ID }) billingId: string,
    @CurrentUser() user: User,
  ): Promise<TransactionModel[]> {
    return this.cardService.findBillingTransactions(billingId, user.id);
  }

  @Auth()
  @Mutation(() => Card)
  async createCard(@Args('data') data: CreateCardInput): Promise<Card> {
    const isCreditCard = data.type === CardType.CREDIT;

    if (isCreditCard) {
      const missingFields = [];
      if (!data.billingCycleDay) {
        missingFields.push('Billing cycle day');
      }
      if (!data.billingPaymentDay) {
        missingFields.push('Billing payment day');
      }
      if (!data.defaultLimit) {
        missingFields.push('Default limit');
      }

      if (missingFields.length > 0) {
        throw new Error(
          `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required for credit cards`,
        );
      }
    }

    return this.cardService.$transaction(async (transactionClient) => {
      const createdCard = await this.cardService.create(
        {
          name: data.name,
          type: data.type,
          billingCycleDay: data.billingCycleDay,
          billingPaymentDay: data.billingPaymentDay,
          institutionLink: {
            connect: {
              id: data.institutionLinkId,
            },
          },
          defaultLimit: data.defaultLimit ?? new Decimal(0),
        },
        transactionClient,
      );

      if (isCreditCard) {
        await this.cardService.createBilling(
          {
            cardId: createdCard.id,
            cardBillingCycleDay: data.billingCycleDay,
            cardBillingPaymentDay: data.billingPaymentDay,
            periodStart: createdCard.createdAt,
            limit: createdCard.defaultLimit,
          },
          transactionClient,
        );
      }

      return createdCard;
    });
  }

  @Auth()
  @Mutation(() => CardBilling)
  async closeBilling(
    @CurrentUser() user: User,
    @Args('billingId') billingId: string,
    @Args('closingDate', { nullable: true }) closingDate?: Date,
  ): Promise<CardBilling> {
    return this.cardService.closeBilling({
      billingId,
      userId: user.id,
      closingDate,
    });
  }

  @Auth()
  @Mutation(() => Card)
  async updateAccountCard(
    @CurrentUser() user: User,
    @Args('cardId', { type: () => ID }) cardId: string,
    @Args('billingCycleDay', { type: () => Number, nullable: true })
    billingCycleDay?: number,
    @Args('billingPaymentDay', { type: () => Number, nullable: true })
    billingPaymentDay?: number,
    @Args('defaultLimit', { type: () => Number, nullable: true })
    defaultLimit?: number,
  ): Promise<Card> {
    return this.cardService.updateCard({
      cardId,
      userId: user.id,
      billingCycleDay,
      billingPaymentDay,
      ...(defaultLimit !== undefined && {
        defaultLimit: new Decimal(defaultLimit),
      }),
    });
  }
}
