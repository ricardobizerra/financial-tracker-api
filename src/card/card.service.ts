import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma/prisma.service';
import { AccountCard, CardBilling } from '@/lib/graphql/prisma-client';
import { CardBillingModel, CardBillingOnDate } from './card.model';
import { Prisma } from '@prisma/client';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async find(
    where: Prisma.AccountCardWhereUniqueInput,
  ): Promise<AccountCard | null> {
    const accountCard = await this.prisma.accountCard.findUnique({
      where,
    });

    return accountCard;
  }

  async findBilling(
    queriedFields: (keyof CardBillingOnDate)[],
    accountId: string,
    userId: string,
    billingId?: string,
  ): Promise<CardBillingOnDate> {
    const billingQueriedFields = queriedFields.reduce(
      (acc, field) => {
        if (field.startsWith('billing.')) {
          acc.push(field.replace('billing.', '') as keyof CardBillingModel);
        }

        return acc;
      },
      [] as (keyof CardBillingModel)[],
    );

    const currentBilling = await this.prisma.cardBilling.findFirst({
      where: {
        ...(billingId
          ? { id: billingId }
          : {
              periodStart: { lte: new Date() },
            }),
        accountCard: {
          account: {
            id: accountId,
            user: { id: userId },
          },
        },
      },
      select: selectObject<CardBilling, CardBillingModel>(billingQueriedFields),
      orderBy: { periodStart: 'desc' },
    });

    const previousBilling =
      queriedFields.includes('previousBillingId') && !!currentBilling
        ? await this.prisma.cardBilling.findFirst({
            where: {
              periodStart: {
                lt: currentBilling.periodStart,
              },
              accountCard: {
                account: {
                  id: accountId,
                  user: { id: userId },
                },
              },
            },
            select: { id: true },
            orderBy: { periodStart: 'desc' },
          })
        : undefined;

    const nextBilling =
      queriedFields.includes('nextBillingId') && !!currentBilling
        ? await this.prisma.cardBilling.findFirst({
            where: {
              periodStart: {
                gt: currentBilling.periodStart,
              },
              accountCard: {
                account: {
                  id: accountId,
                  user: { id: userId },
                },
              },
            },
            select: { id: true },
            orderBy: { periodStart: 'asc' },
          })
        : undefined;

    return {
      billing: currentBilling,
      nextBillingId: nextBilling?.id,
      previousBillingId: previousBilling?.id,
    };
  }
}
