import { Resolver, Query, Args, Info, Mutation, ID } from '@nestjs/graphql';
import { CardService } from './card.service';
import { Card, CardBilling, CardType, User } from '@/lib/graphql/prisma-client';
import { Auth } from '@/auth/auth.decorator';
import { CardBillingOnDate } from './card.model';
import { CurrentUser } from '@/user/user.decorator';
import { AccountService } from '@/account/account.service';
import { NotFoundException } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionModel } from '@/transaction/transaction.model';
import { CreateCardInput } from './create-card.input';

@Resolver(() => Card)
export class CardResolver {
  constructor(
    private readonly cardService: CardService,
    private readonly accountService: AccountService,
  ) {}

  @Auth()
  @Query(() => Card, { nullable: true })
  async accountCard(@Args('id') id: string): Promise<Card> {
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
      institutionConnection: { userId: user.id },
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
          billingCycleDay: data.billingCycleDay ?? 1,
          billingPaymentDay: data.billingPaymentDay ?? 1,
          institutionConnection: {
            connect: {
              id: data.institutionConnectionId,
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
