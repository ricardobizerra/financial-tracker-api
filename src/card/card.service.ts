import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma/prisma.service';
import {
  AccountCard,
  CardBilling,
  CardBillingCreateInput,
} from '@/lib/graphql/prisma-client';
import {
  Account,
  CardBillingStatus,
  PaymentMethod,
  Prisma,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { CardBillingModel, CardBillingOnDate } from './card.model';
import { selectObject } from '@/utils/select-object';
import { Decimal } from '@prisma/client/runtime/library';
import { format } from 'date-fns';

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
    where: Prisma.CardBillingWhereUniqueInput,
  ): Promise<CardBillingModel | null> {
    const billing = await this.prisma.cardBilling.findUnique({
      where,
      include: {
        transactions: true,
        accountCard: {
          include: {
            account: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return {
      ...billing,
      totalAmount: billing?.transactions.reduce(
        (acc, transaction) => acc.add(transaction.amount),
        new Decimal(0),
      ),
    };
  }

  async findCurrentBilling(
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
      select: {
        ...selectObject<CardBilling, CardBillingModel>(billingQueriedFields, {
          totalAmount: [],
        }),
        transactions: true,
      },
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
      billing: {
        ...currentBilling,
        totalAmount: currentBilling?.transactions.reduce(
          (acc, transaction) => acc.add(transaction.amount),
          new Decimal(0),
        ),
      },
      nextBillingId: nextBilling?.id,
      previousBillingId: previousBilling?.id,
    };
  }

  async updatePaymentTransaction(billingId: string): Promise<Transaction> {
    const billing = await this.findBilling({ id: billingId });

    if (!billing) {
      throw new NotFoundException('Card billing not found');
    }

    const existing = await this.prisma.transaction.findFirst({
      where: {
        billingPayment: {
          id: billingId,
        },
        type: TransactionType.BETWEEN_ACCOUNTS,
      },
    });

    if (!existing) {
      throw new NotFoundException('Billing payment transaction not found');
    }

    return this.prisma.transaction.update({
      where: { id: existing.id },
      data: { amount: billing.totalAmount },
    });
  }

  async createBilling({
    cardId,
    cardBillingCycleDay,
    periodStart,
    limit,
  }: {
    cardId: string;
    cardBillingCycleDay: number;
    periodStart: Date;
    limit: Decimal;
  }): Promise<CardBilling> {
    const periodEnd = new Date(periodStart);
    const paymentDate = new Date(periodStart);

    if (periodStart.getDate() > cardBillingCycleDay) {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    periodEnd.setDate(cardBillingCycleDay);
    periodEnd.setHours(23 + 3, 59, 59, 999);

    if (periodStart.getDate() > cardBillingCycleDay) {
      paymentDate.setMonth(paymentDate.getMonth() + 1);
    }

    paymentDate.setDate(cardBillingCycleDay);
    paymentDate.setHours(23 + 3, 59, 59, 999);

    const billing = await this.prisma.cardBilling.create({
      data: {
        accountCard: {
          connect: {
            id: cardId,
          },
        },
        periodStart,
        periodEnd,
        paymentDate,
        status: CardBillingStatus.PENDING,
        limit,
      },
      include: {
        accountCard: {
          include: {
            account: {
              include: {
                institution: true,
                user: true,
              },
            },
          },
        },
      },
    });

    await Promise.all([
      this.prisma.cardBillingHistory.create({
        data: {
          cardBilling: {
            connect: {
              id: billing.id,
            },
          },
          status: CardBillingStatus.PENDING,
        },
      }),
      await this.prisma.transaction.create({
        data: {
          amount: 0,
          date: paymentDate,
          description: `Pagamento - Fatura ${format(billing.periodStart, 'MM/yyyy')} - Cartão ${billing.accountCard.account.institution.name}`,
          status: TransactionStatus.PLANNED,
          type: TransactionType.BETWEEN_ACCOUNTS,
          paymentEnabled: false,
          paymentLimit: paymentDate,
          destinyAccount: {
            connect: {
              id: billing.accountCard.account.id,
            },
          },
          billingPayment: {
            connect: {
              id: billing.id,
            },
          },
          user: {
            connect: {
              id: billing.accountCard.account.user.id,
            },
          },
        },
      }),
    ]);

    return billing;
  }

  async closeBilling({
    billingId,
    userId,
  }: {
    billingId: string;
    userId: string;
  }) {
    const billing = await this.prisma.cardBilling.findFirst({
      where: {
        id: billingId,
        accountCard: {
          account: {
            userId,
          },
        },
        status: CardBillingStatus.PENDING,
      },
      include: {
        accountCard: {
          include: {
            account: true,
          },
        },
        paymentTransaction: true,
      },
    });

    if (!billing) {
      throw new NotFoundException('Billing not found or already closed');
    }

    await this.prisma.transaction.update({
      where: {
        id: billing.paymentTransaction.id,
      },
      data: {
        paymentEnabled: true,
      },
    });

    return this.prisma.cardBilling.update({
      where: { id: billingId },
      data: {
        status: CardBillingStatus.CLOSED,
      },
    });
  }
}
