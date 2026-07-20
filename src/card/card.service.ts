import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../lib/prisma/prisma.service';
import {
  Card,
  CardBilling,
  CardBillingCreateInput,
  CardCreateInput,
} from '@/lib/graphql/prisma-client';
import { TransactionModel } from '@/transaction/transaction.model';
import {
  Account,
  CardBillingStatus,
  CardType,
  PaymentMethod,
  Prisma,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import {
  CardBillingModel,
  CardBillingOnDate,
  CardFilterArgs,
  OrdenationCardArgs,
} from './card.model';
import { selectObject } from '@/utils/select-object';
import { Decimal } from '@prisma/client/runtime/library';
import { format } from 'date-fns';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';

@Injectable()
export class CardService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.checkBillingStatuses();
  }

  async findOrCreateBillingForDate(
    {
      cardId,
      billingCycleDay,
      billingPaymentDay,
      limit,
      date,
    }: {
      cardId: string;
      billingCycleDay: number;
      billingPaymentDay: number;
      limit: Decimal;
      date: Date;
    },
    transactionClient: Prisma.TransactionClient = this.prisma,
  ): Promise<CardBilling> {
    const billing = await transactionClient.cardBilling.findFirst({
      where: {
        cardId,
        periodStart: { lte: date },
        OR: [{ periodEnd: { gte: date } }, { periodEnd: null }],
      },
      orderBy: { createdAt: 'asc' },
    });

    if (billing) {
      return billing;
    }

    return this.createBilling(
      {
        cardId,
        cardBillingCycleDay: billingCycleDay,
        cardBillingPaymentDay: billingPaymentDay,
        periodStart: date,
        limit,
      },
      transactionClient,
    );
  }

  async syncParentTransactionBillingFromFirstInstallment(
    transactionId: string,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ): Promise<string | null> {
    const firstInstallment =
      await transactionClient.transactionInstallment.findFirst({
        where: {
          transactionId,
          installmentNumber: 1,
        },
        select: {
          cardBillingId: true,
        },
      });

    if (!firstInstallment) {
      return null;
    }

    await transactionClient.transaction.update({
      where: { id: transactionId },
      data: {
        cardBillingId: firstInstallment.cardBillingId ?? null,
      },
    });

    return firstInstallment.cardBillingId ?? null;
  }

  async find(
    where: Prisma.CardWhereUniqueInput,
    queriedFields?: (keyof Card)[],
  ): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({
      where,
      select: queriedFields
        ? selectObject<Card, Card>(queriedFields)
        : undefined,
    });

    return card;
  }

  async findMany({
    userId,
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
    filterArgs,
  }: {
    userId: string;
    queriedFields: (keyof Card)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationCardArgs;
    filterArgs: CardFilterArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const queryWhere: Prisma.CardWhereInput = {
      institutionLink: {
        userId,
        ...(filterArgs.institutionLinkId && {
          id: filterArgs.institutionLinkId,
        }),
      },
      ...(filterArgs.types?.length && {
        type: { in: filterArgs.types },
      }),
      ...(!!searchArgs.search && {
        name: {
          contains: searchArgs.search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const lengthQuery = last
      ? await this.prisma.card.count({ where: queryWhere })
      : undefined;

    const length = !!lengthQuery ? Number(lengthQuery) : undefined;

    const cards = await this.prisma.card.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : length % last === 0
            ? last
            : length % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? length - unbufferedCursor + 1
          : unbufferedCursor
        : last
          ? 0
          : undefined,
      orderBy: orderBy
        ? {
            [orderBy]: last
              ? orderDirection === OrderDirection.Asc
                ? OrderDirection.Desc
                : OrderDirection.Asc
              : orderDirection === OrderDirection.Asc
                ? OrderDirection.Asc
                : OrderDirection.Desc,
          }
        : undefined,
      select: selectObject<Card, Card>(queriedFields),
      where: queryWhere,
    });

    if (last) {
      cards.reverse();
    }

    if (cards.length === 0) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: !!after,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    const edges = cards.map((card, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : length - cards.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      return {
        cursor: bufferedCursor,
        node: card,
      };
    });

    const startCursor = edges[0].cursor;
    const endCursor = edges[edges.length - 1].cursor;

    if (!first && !last) {
      return {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: !!after,
          startCursor,
          endCursor,
        },
      };
    }

    const extraItem = !(
      last && Number(Buffer.from(startCursor, 'base64').toString('utf-8')) <= 1
    )
      ? await this.prisma.card.findFirst({
          take: 1,
          skip: last
            ? Number(Buffer.from(startCursor, 'base64').toString('utf-8')) - 2
            : first
              ? Number(Buffer.from(endCursor, 'base64').toString('utf-8'))
              : unbufferedCursor,
          orderBy: orderBy
            ? {
                [orderBy]: last
                  ? orderDirection === OrderDirection.Asc
                    ? OrderDirection.Desc
                    : OrderDirection.Asc
                  : orderDirection === OrderDirection.Asc
                    ? OrderDirection.Asc
                    : OrderDirection.Desc,
              }
            : undefined,
          select: { id: true },
          where: queryWhere,
        })
      : undefined;

    const hasNextPage = last ? !!before : !!extraItem;
    const hasPreviousPage = last ? !!extraItem : !!after;

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
      },
    };
  }

  async $transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  async create(
    data: CardCreateInput,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.card.create({ data });
  }

  async updateCard({
    cardId,
    userId,
    billingCycleDay,
    billingPaymentDay,
    defaultLimit,
  }: {
    cardId: string;
    userId: string;
    billingCycleDay?: number;
    billingPaymentDay?: number;
    defaultLimit?: Decimal;
  }): Promise<Card> {
    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        institutionLink: {
          userId,
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedCard = await tx.card.update({
        where: { id: cardId },
        data: {
          ...(billingCycleDay !== undefined && { billingCycleDay }),
          ...(billingPaymentDay !== undefined && { billingPaymentDay }),
          ...(defaultLimit !== undefined && { defaultLimit }),
        },
      });

      if (defaultLimit !== undefined) {
        await tx.cardBilling.updateMany({
          where: {
            cardId,
            status: { in: [CardBillingStatus.PENDING, CardBillingStatus.FUTURE] },
          },
          data: {
            limit: defaultLimit,
          },
        });
      }

      return updatedCard;
    });
  }

  async findBilling(
    where: Prisma.CardBillingWhereUniqueInput,
  ): Promise<CardBillingModel | null> {
    let billing = await this.prisma.cardBilling.findUnique({
      where,
      include: {
        transactions: {
          where: {
            deletedAt: null,
            installments: { none: {} },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
        card: {
          include: {
            institutionLink: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (billing && billing.status === CardBillingStatus.PENDING) {
      const today = new Date();
      if (today > new Date(billing.periodEnd!)) {
        await this.closeBillingInternal(billing.id, undefined, billing.periodEnd!);
        return this.findBilling(where);
      }
    }

    if (!billing) return null;

    const activeTransactions = billing.transactions ?? [];

    // Somar transações normais
    const transactionsTotal = activeTransactions?.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    // Somar installments (parcelas) - apenas de transações não canceladas
    const installmentsTotal =
      billing?.installments
        ?.filter((i) => !i.transaction?.deletedAt)
        .reduce(
          (acc, installment) => acc.add(installment.amount),
          new Decimal(0),
        ) ?? new Decimal(0);

    const totalAmount = transactionsTotal.add(installmentsTotal);

    const installmentsCount =
      billing?.installments?.filter(
        (i) => !i.transaction?.deletedAt,
      ).length ?? 0;

    return {
      ...billing,
      totalAmount,
      usagePercentage: totalAmount.div(billing?.limit).mul(100).toNumber(),
      transactionsCount: (activeTransactions?.length ?? 0) + installmentsCount,
    };
  }

  private mapBillingWithComputedTotals(billing: any): CardBillingModel {
    const activeTransactions = billing?.transactions ?? [];
    const transactionsTotal = activeTransactions.reduce(
      (acc: Decimal, transaction: any) => acc.add(transaction.amount),
      new Decimal(0),
    );
    const installmentsTotal =
      billing?.installments
        ?.filter(
          (i: any) => !i.transaction?.deletedAt,
        )
        .reduce(
          (acc: Decimal, installment: any) => acc.add(installment.amount),
          new Decimal(0),
        ) ?? new Decimal(0);
    const totalAmount = transactionsTotal.add(installmentsTotal);
    const installmentsCount =
      billing?.installments?.filter(
        (i: any) => !i.transaction?.deletedAt,
      ).length ?? 0;

    return {
      ...billing,
      totalAmount,
      usagePercentage: totalAmount.div(billing?.limit).mul(100).toNumber(),
      transactionsCount: (activeTransactions?.length ?? 0) + installmentsCount,
    };
  }

  async findCurrentPendingBilling(
    cardId: string,
  ): Promise<CardBillingModel | null> {
    const billing = await this.prisma.cardBilling.findFirst({
      where: {
        cardId,
        periodStart: { lte: new Date() },
        status: CardBillingStatus.PENDING,
      },
      orderBy: { periodStart: 'desc' },
      include: {
        transactions: {
          where: {
            deletedAt: null,
            installments: { none: {} },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
      },
    });

    if (billing) {
      const today = new Date();
      if (today > new Date(billing.periodEnd!)) {
        await this.closeBillingInternal(billing.id, undefined, billing.periodEnd!);
        return this.findCurrentPendingBilling(cardId);
      }
    }

    if (!billing) return null;
    return this.mapBillingWithComputedTotals(billing);
  }

  async findPayableBillings(cardId: string): Promise<CardBillingModel[]> {
    const expiredPending = await this.prisma.cardBilling.findFirst({
      where: {
        cardId,
        status: CardBillingStatus.PENDING,
        periodEnd: { lt: new Date() },
      },
    });

    if (expiredPending) {
      await this.closeBillingInternal(expiredPending.id, undefined, expiredPending.periodEnd!);
      return this.findPayableBillings(cardId);
    }

    const billings = await this.prisma.cardBilling.findMany({
      where: {
        cardId,
        periodStart: { lte: new Date() },
        status: { in: [CardBillingStatus.CLOSED, CardBillingStatus.OVERDUE] },
      },
      orderBy: [{ paymentDate: 'asc' }, { periodStart: 'asc' }],
      include: {
        transactions: {
          where: {
            deletedAt: null,
            installments: { none: {} },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
      },
    });

    return billings.map((billing) =>
      this.mapBillingWithComputedTotals(billing),
    );
  }

  async healCardBillingData(cardId: string): Promise<void> {
    // Delete any corrupted billings (periodStart > periodEnd)
    const billings = await this.prisma.cardBilling.findMany({
      where: { cardId },
    });
    for (const b of billings) {
      if (b.periodEnd && new Date(b.periodStart) > new Date(b.periodEnd)) {
        await this.prisma.cardBilling.delete({
          where: { id: b.id },
        });
      }
    }

    const activeBillings = await this.prisma.cardBilling.findMany({
      where: { cardId },
      orderBy: { periodStart: 'asc' },
    });

    if (activeBillings.length === 0) return;

    // Move floating or mismatched transactions to their correct billing periods
    const cardTransactions = await this.prisma.transaction.findMany({
      where: { sourceCardId: cardId, deletedAt: null },
    });

    for (const tx of cardTransactions) {
      const correctBilling = activeBillings.find(
        (b) => tx.date >= b.periodStart && tx.date <= b.periodEnd,
      );

      if (correctBilling && tx.cardBillingId !== correctBilling.id) {
        await this.prisma.transaction.update({
          where: { id: tx.id },
          data: { cardBillingId: correctBilling.id },
        });
      }
    }

    // Move floating or mismatched installments to their correct billing periods
    const cardInstallments = await this.prisma.transactionInstallment.findMany({
      where: {
        transaction: { sourceCardId: cardId, deletedAt: null },
      },
      include: {
        transaction: true,
      },
    });

    for (const inst of cardInstallments) {
      if (!inst.transaction) continue;
      const instDate = new Date(inst.transaction.date);
      instDate.setMonth(instDate.getMonth() + (inst.installmentNumber - 1));

      const correctBilling = activeBillings.find(
        (b) => instDate >= b.periodStart && instDate <= b.periodEnd,
      );

      if (correctBilling && inst.cardBillingId !== correctBilling.id) {
        await this.prisma.transactionInstallment.update({
          where: { id: inst.id },
          data: { cardBillingId: correctBilling.id },
        });
      }
    }

    // Sync parent transactions
    const parentIds = Array.from(new Set(cardInstallments.map((i) => i.transactionId)));
    for (const parentId of parentIds) {
      await this.syncParentTransactionBillingFromFirstInstallment(parentId);
    }

    // Recalculate totals for all active billings to make sure they match new transaction locations
    for (const b of activeBillings) {
      await this.updatePaymentTransaction(b.id);
    }
  }

  async fillBillingGaps(cardId: string, userId: string): Promise<void> {
    await this.healCardBillingData(cardId);

    const card = await this.prisma.card.findFirst({
      where: {
        id: cardId,
        institutionLink: { userId },
      },
      include: {
        billings: {
          orderBy: { periodStart: 'asc' },
        },
      },
    });

    if (!card || card.billings.length <= 1) {
      return;
    }

    const billings = card.billings;
    for (let i = 0; i < billings.length - 1; i++) {
      const current = billings[i];
      const next = billings[i + 1];

      const currentEnd = new Date(current.periodEnd);
      const nextStart = new Date(next.periodStart);

      // A gap exists if nextStart is more than 2 days after currentEnd
      const diffTime = nextStart.getTime() - currentEnd.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 2) {
        const gapStart = new Date(currentEnd);
        gapStart.setDate(gapStart.getDate() + 1);
        gapStart.setUTCHours(3, 0, 0, 0);

        await this.findOrCreateBillingForDate({
          cardId,
          billingCycleDay: card.billingCycleDay,
          billingPaymentDay: card.billingPaymentDay,
          limit: card.defaultLimit,
          date: gapStart,
        });

        // Recurse to find any subsequent gaps
        return this.fillBillingGaps(cardId, userId);
      }
    }
  }

  async findCurrentBilling(
    queriedFields: (keyof CardBillingOnDate)[],
    cardId: string,
    userId: string,
    billingId?: string,
  ): Promise<CardBillingOnDate> {
    await this.fillBillingGaps(cardId, userId);

    if (!billingId) {
      const expiredPending = await this.prisma.cardBilling.findFirst({
        where: {
          cardId,
          status: CardBillingStatus.PENDING,
          periodEnd: { lt: new Date() },
        },
      });
      if (expiredPending) {
        await this.closeBillingInternal(expiredPending.id, userId, expiredPending.periodEnd!);
      }
    }

    const billingQueriedFields = queriedFields.reduce(
      (acc, field) => {
        if (field.startsWith('billing.')) {
          acc.push(field.replace('billing.', '') as keyof CardBillingModel);
        }

        return acc;
      },
      [] as (keyof CardBillingModel)[],
    );

    let currentBilling: any = await this.prisma.cardBilling.findFirst({
      where: {
        ...(billingId
          ? { id: billingId }
          : {
              periodStart: { lte: new Date() },
            }),
        card: {
          id: cardId,
          institutionLink: {
            userId,
          },
        },
      },
      select: {
        ...selectObject<CardBilling, CardBillingModel>(billingQueriedFields, {
          totalAmount: [],
          usagePercentage: [],
          transactionsCount: [],
        }),
        transactions: {
          where: {
            deletedAt: null,
            installments: { none: {} },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
      },
      orderBy: { periodStart: 'desc' },
    });

    // Se billingId foi passado mas não encontrado, buscar a fatura corrente
    if (!currentBilling && billingId) {
      currentBilling = await this.prisma.cardBilling.findFirst({
        where: {
          periodStart: { lte: new Date() },
          card: {
            id: cardId,
            institutionLink: {
              userId,
            },
          },
        },
        select: {
          ...selectObject<CardBilling, CardBillingModel>(billingQueriedFields, {
            totalAmount: [],
            usagePercentage: [],
            transactionsCount: [],
          }),
          transactions: {
            where: {
              deletedAt: null,
              installments: { none: {} },
            },
          },
          installments: {
            include: {
              transaction: true,
            },
          },
        },
        orderBy: { periodStart: 'desc' },
      });
    }

    const previousBilling =
      queriedFields.includes('previousBillingId') && !!currentBilling
        ? await this.prisma.cardBilling.findFirst({
            where: {
              periodStart: {
                lt: currentBilling.periodStart,
              },
              card: {
                id: cardId,
                institutionLink: {
                  userId,
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
              card: {
                id: cardId,
                institutionLink: {
                  userId,
                },
              },
            },
            select: { id: true },
            orderBy: { periodStart: 'asc' },
          })
        : undefined;

    const activeTransactions = currentBilling?.transactions ?? [];

    // Soma transações normais
    const transactionsTotal = activeTransactions?.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    // Soma installments (parcelas) - apenas de transações não canceladas
    const installmentsTotal =
      currentBilling?.installments
        ?.filter((i) => !i.transaction?.deletedAt)
        .reduce(
          (acc, installment) => acc.add(installment.amount),
          new Decimal(0),
        ) ?? new Decimal(0);

    const totalAmount = transactionsTotal.add(installmentsTotal);

    const installmentsCount =
      currentBilling?.installments?.filter(
        (i) => !i.transaction?.deletedAt,
      ).length ?? 0;

    return {
      billing: {
        ...currentBilling,
        totalAmount,
        usagePercentage: totalAmount
          .div(currentBilling?.limit)
          .mul(100)
          .toNumber(),
        transactionsCount:
          (activeTransactions?.length ?? 0) + installmentsCount,
      },
      nextBillingId: nextBilling?.id,
      previousBillingId: previousBilling?.id,
    };
  }

  async findBillingTransactions(
    billingId: string,
    userId: string,
    searchArgs: SearchArgs,
  ): Promise<TransactionModel[]> {
    const searchCondition = searchArgs.search
      ? {
          description: {
            contains: searchArgs.search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const billing = await this.prisma.cardBilling.findFirst({
      where: {
        id: billingId,
        card: {
          institutionLink: {
            userId,
          },
        },
      },
      include: {
        // Transações normais (não-parceladas) vinculadas diretamente ao billing
        transactions: {
          include: {
            sourceAccount: {
              include: {
                institutionLink: { include: { institution: true } },
              },
            },
            destinyAccount: {
              include: {
                institutionLink: { include: { institution: true } },
              },
            },
            sourceCard: {
              include: {
                institutionLink: { include: { institution: true } },
              },
            },
            cardBilling: true,
          },
          where: {
            deletedAt: null,
            installments: {
              none: {},
            },
            ...searchCondition,
          },
        },
        // Parcelas (installments) vinculadas ao billing
        installments: {
          include: {
            transaction: {
              include: {
                sourceAccount: {
                  include: {
                    institutionLink: { include: { institution: true } },
                  },
                },
                destinyAccount: {
                  include: {
                    institutionLink: { include: { institution: true } },
                  },
                },
                sourceCard: {
                  include: {
                    institutionLink: { include: { institution: true } },
                  },
                },
                cardBilling: true,
                installments: true, // Para contar total de parcelas
              },
            },
          },
          where: {
            transaction: {
              deletedAt: null,
              ...searchCondition,
            },
          } as any,
        },
      },
    });

    if (!billing) {
      return [];
    }

    const result: TransactionModel[] = [];

    // Adicionar transações normais (sem installments associados) com installment = null
    for (const transaction of billing.transactions) {
      result.push({
        ...transaction,
        installmentNumber: null,
        totalInstallments: null,
        installmentId: null,
      });
    }

    // Adicionar transações parceladas via installments
    for (const installment of billing.installments) {
      if (!installment.transaction || installment.transaction.deletedAt) continue;

      const totalInstallments =
        installment.transaction.installments?.length ?? 0;

      result.push({
        ...installment.transaction,
        // Override amount com o valor da parcela específica
        amount: installment.amount,
        installmentNumber: installment.installmentNumber,
        totalInstallments,
        installmentId: installment.id,
      });
    }

    // Ordenar por data
    result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return result;
  }

  async updatePaymentTransaction(
    billingId: string,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ): Promise<Transaction | null> {
    const billing = (await transactionClient.cardBilling.findUnique({
      where: { id: billingId },
      include: {
        transactions: {
          where: {
            deletedAt: null,
            installments: { none: {} },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
        card: {
          include: {
            institutionLink: {
              include: {
                institution: true,
                user: true,
              },
            },
          },
        },
      },
    })) as any;

    if (!billing) {
      throw new NotFoundException('Card billing not found');
    }

    // Calcular total de transações normais (apenas não canceladas)
    const transactionsTotal = billing.transactions.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    // Calcular total de installments (parcelas) - apenas de transações não canceladas
    const installmentsTotal = billing.installments
      .filter((i) => !i.transaction?.deletedAt)
      .reduce(
        (acc, installment) => acc.add(installment.amount),
        new Decimal(0),
      );

    const totalAmount = transactionsTotal.add(installmentsTotal);

    const existing = await transactionClient.transaction.findFirst({
      where: {
        billingPayment: {
          id: billingId,
        },
        type: TransactionType.EXPENSE,
      },
    });

    // Se amount > 0 e transação não existe, criar
    if (totalAmount.greaterThan(0) && !existing) {
      return transactionClient.transaction.create({
        data: {
          amount: totalAmount,
          date: billing.paymentDate,
          description: `Pagamento - Fatura ${format(billing.periodStart, 'MM/yyyy')} - Cartão ${billing.card.name}`,
          status: TransactionStatus.PLANNED,
          type: TransactionType.EXPENSE,
          paymentEnabled: false,
          paymentLimit: billing.paymentDate,
          billingPayment: {
            connect: {
              id: billing.id,
            },
          },
          user: {
            connect: {
              id: billing.card.institutionLink.user.id,
            },
          },
        },
      });
    }

    // Se amount > 0 e transação existe, atualizar
    if (totalAmount.greaterThan(0) && existing) {
      return transactionClient.transaction.update({
        where: { id: existing.id },
        data: { amount: totalAmount },
      });
    }

    // Se amount == 0 e transação existe, desassociar do billing e deletar
    if (totalAmount.equals(0) && existing) {
      // Primeiro desassociar do billingPayment
      await transactionClient.transaction.update({
        where: { id: existing.id },
        data: { billingPayment: { disconnect: true } },
      });
      // Depois deletar
      await transactionClient.transaction.delete({
        where: { id: existing.id },
      });
    }

    // Se amount == 0, verificar se a fatura pode ser deletada
    if (totalAmount.equals(0)) {
      // Buscar a fatura corrente (primeira com periodStart <= hoje)
      const today = new Date();
      const currentBilling = await transactionClient.cardBilling.findFirst({
        where: {
          cardId: billing.card.id,
          periodStart: { lte: today },
        },
        orderBy: { periodStart: 'desc' },
        select: { id: true },
      });

      // Se não é a fatura corrente e não tem transações ativas, deletar
      if (currentBilling?.id !== billing.id) {
        // Verificar se realmente não tem transações ativas
        const activeTransactionsCount = await transactionClient.transaction.count({
          where: {
            cardBillingId: billing.id,
            installments: { none: {} },
          },
        });

        // Não deletar se existir uma fatura posterior (evita furos na linha do tempo)
        const nextBillingExists = await transactionClient.cardBilling.findFirst({
          where: {
            cardId: billing.card.id,
            periodStart: { gt: billing.periodStart },
          },
          select: { id: true },
        });

        if (activeTransactionsCount === 0 && !nextBillingExists) {
          await transactionClient.cardBilling.delete({
            where: { id: billing.id },
          });
        }
      }

      return null;
    }

    return null;
  }

  async createBilling(
    {
      cardId,
      cardBillingCycleDay,
      cardBillingPaymentDay,
      periodStart,
      limit,
    }: {
      cardId: string;
      cardBillingCycleDay: number;
      cardBillingPaymentDay: number;
      periodStart: Date;
      limit: Decimal;
    },
    transactionClient: Prisma.TransactionClient = this.prisma,
  ): Promise<CardBilling> {
    // Calcular o início correto do período baseado no dia de fechamento
    // O período começa no dia seguinte ao fechamento do ciclo anterior
    const calculatedPeriodStart = new Date(periodStart);
    const periodEnd = new Date(periodStart);
    const paymentDate = new Date(periodStart);

    // Se a data está antes do dia de fechamento, pertence ao ciclo atual
    // Se está no dia de fechamento ou depois, pertence ao próximo ciclo
    // (transações NO dia de fechamento vão para a fatura corrente que está fechando)
    if (periodStart.getDate() < cardBillingCycleDay) {
      // A transação está no ciclo atual
      // periodStart deve ser o dia após o fechamento do mês anterior
      calculatedPeriodStart.setMonth(calculatedPeriodStart.getMonth() - 1);
      calculatedPeriodStart.setDate(cardBillingCycleDay + 1);

      periodEnd.setDate(cardBillingCycleDay);
    } else {
      // A transação está no dia de fechamento ou depois → próximo ciclo
      // periodStart é o dia após o fechamento do mês atual
      calculatedPeriodStart.setDate(cardBillingCycleDay + 1);

      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(cardBillingCycleDay);
    }

    // Normalize period boundaries to UTC-3 day anchors represented in UTC:
    // start: 03:00:00.000Z (00:00 local), end: next day 02:59:59.999Z (23:59:59.999 local)
    calculatedPeriodStart.setUTCHours(3, 0, 0, 0);
    periodEnd.setDate(periodEnd.getDate() + 1);
    periodEnd.setUTCHours(2, 59, 59, 999);

    // Ajustar calculatedPeriodStart caso a fatura anterior tenha uma data de fechamento customizada
    const overlappingPreviousBilling = await transactionClient.cardBilling.findFirst({
      where: {
        cardId,
        periodEnd: { lt: periodEnd },
      },
      orderBy: { periodEnd: 'desc' },
    });

    if (overlappingPreviousBilling) {
      calculatedPeriodStart.setTime(new Date(overlappingPreviousBilling.periodEnd).getTime());
      calculatedPeriodStart.setDate(calculatedPeriodStart.getDate() + 1);
      calculatedPeriodStart.setUTCHours(3, 0, 0, 0);
    }

    // Calcular data de pagamento - deve ser baseada em periodEnd, não periodStart
    // O pagamento ocorre após o fechamento da fatura (periodEnd)
    // Se o dia de pagamento é maior que o dia de fechamento, pagamento é no mesmo mês
    // Se o dia de pagamento é menor ou igual ao dia de fechamento, pagamento é no próximo mês
    if (cardBillingPaymentDay <= cardBillingCycleDay) {
      // Pagamento é no mês seguinte ao fechamento
      paymentDate.setFullYear(periodEnd.getFullYear());
      paymentDate.setMonth(periodEnd.getMonth() + 1);
    } else {
      // Pagamento é no mesmo mês do fechamento
      paymentDate.setFullYear(periodEnd.getFullYear());
      paymentDate.setMonth(periodEnd.getMonth());
    }
    paymentDate.setDate(cardBillingPaymentDay);
    paymentDate.setUTCHours(3, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const initialStatus = calculatedPeriodStart > today
      ? CardBillingStatus.FUTURE
      : CardBillingStatus.PENDING;

    const billing = await transactionClient.cardBilling.create({
      data: {
        card: {
          connect: {
            id: cardId,
          },
        },
        periodStart: calculatedPeriodStart,
        periodEnd,
        paymentDate,
        status: initialStatus,
        limit,
      },
      include: {
        card: {
          include: {
            institutionLink: {
              include: {
                institution: true,
                user: true,
              },
            },
          },
        },
      },
    });

    // Criar apenas o histórico da fatura
    // A transação de pagamento será criada automaticamente pelo updatePaymentTransaction
    // quando a primeira despesa for adicionada à fatura
    await transactionClient.cardBillingHistory.create({
      data: {
        cardBilling: {
          connect: {
            id: billing.id,
          },
        },
        status: initialStatus,
      },
    });

    return billing;
  }

  async closeBillingInternal(
    billingId: string,
    userId?: string,
    closingDate?: Date,
    txClient: Prisma.TransactionClient = this.prisma,
  ): Promise<CardBilling> {
    const billing = (await txClient.cardBilling.findFirst({
      where: {
        id: billingId,
        status: CardBillingStatus.PENDING,
        ...(userId && {
          card: {
            institutionLink: {
              userId,
            },
          },
        }),
      },
      include: {
        card: {
          include: {
            institutionLink: true,
          },
        },
        paymentTransaction: true,
        transactions: {
          where: {
            deletedAt: null,
            installments: { none: {} },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
      },
    })) as any;

    if (!billing) {
      throw new NotFoundException('Billing not found or already closed');
    }

    if (!closingDate && !billing.periodEnd) {
      throw new Error('periodEnd on a CardBilling cannot be null');
    }

    // Normalize closing date to end of day
    const closeDateNormalized = new Date(closingDate ?? billing.periodEnd!);
    closeDateNormalized.setHours(23, 59, 59, 999);

    // Separate transactions: those within the closing period vs those after
    const transactionsInBilling = billing.transactions.filter(
      (t) => new Date(t.date) <= closeDateNormalized,
    );
    const transactionsForNextBilling = billing.transactions.filter(
      (t) => new Date(t.date) > closeDateNormalized,
    );

    // Create/reuse next billing cycle
    const nextPeriodStart = new Date(billing.periodEnd ?? closeDateNormalized);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 1);
    nextPeriodStart.setUTCHours(3, 0, 0, 0);

    const nextBilling = await this.findOrCreateBillingForDate(
      {
        cardId: billing.cardId,
        billingCycleDay: billing.card.billingCycleDay,
        billingPaymentDay: billing.card.billingPaymentDay,
        limit: billing.card.defaultLimit,
        date: nextPeriodStart,
      },
      txClient,
    );

    // Move transactions after closing date to new billing
    if (transactionsForNextBilling.length > 0) {
      await txClient.transaction.updateMany({
        where: {
          id: { in: transactionsForNextBilling.map((t) => t.id) },
        },
        data: {
          cardBillingId: nextBilling.id,
        },
      });
    }

    // Move installments after closing date to new billing
    if (billing.installments && billing.installments.length > 0) {
      const installmentsForNextBilling = billing.installments.filter(
        (i) =>
          i.transaction && new Date(i.transaction.date) > closeDateNormalized,
      );

      if (installmentsForNextBilling.length > 0) {
        await txClient.transactionInstallment.updateMany({
          where: {
            id: { in: installmentsForNextBilling.map((i) => i.id) },
          },
          data: {
            cardBillingId: nextBilling.id,
          },
        });

        const parentTransactionIds = Array.from(
          new Set(installmentsForNextBilling.map((i) => i.transactionId)),
        );

        await Promise.all(
          parentTransactionIds.map((transactionId: any) =>
            this.syncParentTransactionBillingFromFirstInstallment(
              transactionId,
              txClient,
            ),
          ),
        );
      }
    }

    // Garantir que a transação de pagamento existe e atualizar com o valor correto
    const paymentTransaction = await this.updatePaymentTransaction(billingId, txClient);

    // Se a transação existe, habilitar para pagamento
    if (paymentTransaction) {
      await txClient.transaction.update({
        where: { id: paymentTransaction.id },
        data: { paymentEnabled: true },
      });
    }

    // Determine target status
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const status = (billing.paymentDate && new Date(billing.paymentDate) < today)
      ? CardBillingStatus.OVERDUE
      : CardBillingStatus.CLOSED;

    await txClient.cardBillingHistory.create({
      data: {
        cardBilling: { connect: { id: billing.id } },
        status,
      },
    });

    // Close current billing with actual period end
    return txClient.cardBilling.update({
      where: { id: billingId },
      data: {
        status,
        periodEnd: closeDateNormalized,
      },
    });
  }

  async closeBilling({
    billingId,
    userId,
    closingDate,
  }: {
    billingId: string;
    userId: string;
    closingDate?: Date;
  }): Promise<CardBilling> {
    return this.closeBillingInternal(billingId, userId, closingDate);
  }

  async changeBillingDates({
    billingId,
    userId,
    closingDate,
    paymentDate,
  }: {
    billingId: string;
    userId: string;
    closingDate?: Date;
    paymentDate?: Date;
  }): Promise<CardBilling> {
    return this.prisma.$transaction(async (tx) => {
      const billing = await tx.cardBilling.findFirst({
        where: {
          id: billingId,
          card: {
            institutionLink: {
              userId,
            },
          },
        },
        include: {
          card: true,
          paymentTransaction: true,
        },
      });

      if (!billing) {
        throw new NotFoundException('Billing not found');
      }

      if (billing.status === CardBillingStatus.PAID) {
        throw new Error('Não é possível alterar datas de uma fatura paga.');
      }

      const updateData: Prisma.CardBillingUpdateInput = {};

      let closeDateNormalized: Date | undefined;
      if (closingDate !== undefined && closingDate !== null) {
        closeDateNormalized = new Date(closingDate);
        closeDateNormalized.setHours(23, 59, 59, 999);
        updateData.periodEnd = closeDateNormalized;
      }

      if (paymentDate !== undefined && paymentDate !== null) {
        const paymentDateNormalized = new Date(paymentDate);
        paymentDateNormalized.setUTCHours(3, 0, 0, 0);
        updateData.paymentDate = paymentDateNormalized;
      }

      // If closingDate changed, handle transaction/installment shifts and pullbacks
      if (closeDateNormalized && closeDateNormalized.getTime() !== billing.periodEnd?.getTime()) {
        const oldClosingDate = billing.periodEnd ? new Date(billing.periodEnd) : new Date(billing.periodStart);

        const nextBilling = await tx.cardBilling.findFirst({
          where: {
            cardId: billing.cardId,
            periodStart: { gt: billing.periodStart },
          },
          orderBy: { periodStart: 'asc' },
        });

        if (closeDateNormalized > oldClosingDate) {
          if (nextBilling) {
            // Empurra o início da próxima fatura para o dia seguinte ao novo fechamento
            const newNextPeriodStart = new Date(closeDateNormalized);
            newNextPeriodStart.setDate(newNextPeriodStart.getDate() + 1);
            newNextPeriodStart.setUTCHours(3, 0, 0, 0);

            await tx.cardBilling.update({
              where: { id: nextBilling.id },
              data: { periodStart: newNextPeriodStart },
            });

            const transactionsToPull = await tx.transaction.findMany({
              where: {
                cardBillingId: nextBilling.id,
                date: { lte: closeDateNormalized },
                deletedAt: null,
                installments: { none: {} },
              },
              select: { id: true },
            });

            if (transactionsToPull.length > 0) {
              await tx.transaction.updateMany({
                where: {
                  id: { in: transactionsToPull.map((t) => t.id) },
                },
                data: {
                  cardBillingId: billing.id,
                },
              });
            }

            const nextBillingInstallments = await tx.transactionInstallment.findMany({
              where: {
                cardBillingId: nextBilling.id,
              },
              include: {
                transaction: true,
              },
            });

            const installmentsToPull = nextBillingInstallments.filter((inst) => {
              if (!inst.transaction || inst.transaction.deletedAt) return false;
              const instDate = new Date(inst.transaction.date);
              instDate.setMonth(instDate.getMonth() + (inst.installmentNumber - 1));
              return instDate <= closeDateNormalized;
            });

            if (installmentsToPull.length > 0) {
              await tx.transactionInstallment.updateMany({
                where: {
                  id: { in: installmentsToPull.map((i) => i.id) },
                },
                data: {
                  cardBillingId: billing.id,
                },
              });

              const parentIds = Array.from(new Set(installmentsToPull.map((i) => i.transactionId)));
              await Promise.all(
                parentIds.map((txId) =>
                  this.syncParentTransactionBillingFromFirstInstallment(txId, tx),
                ),
              );
            }
          }
        } else {
          const nextPeriodStart = new Date(closeDateNormalized);
          nextPeriodStart.setDate(nextPeriodStart.getDate() + 1);
          nextPeriodStart.setUTCHours(3, 0, 0, 0);

          const targetNextBilling = nextBilling ?? await this.findOrCreateBillingForDate(
            {
              cardId: billing.cardId,
              billingCycleDay: billing.card.billingCycleDay,
              billingPaymentDay: billing.card.billingPaymentDay,
              limit: billing.card.defaultLimit,
              date: nextPeriodStart,
            },
            tx,
          );

          const transactionsToShift = await tx.transaction.findMany({
            where: {
              cardBillingId: billing.id,
              date: { gt: closeDateNormalized },
              deletedAt: null,
              installments: { none: {} },
            },
            select: { id: true },
          });

          if (transactionsToShift.length > 0) {
            await tx.transaction.updateMany({
              where: {
                id: { in: transactionsToShift.map((t) => t.id) },
              },
              data: {
                cardBillingId: targetNextBilling.id,
              },
            });
          }

          const currentBillingInstallments = await tx.transactionInstallment.findMany({
            where: {
              cardBillingId: billing.id,
            },
            include: {
              transaction: true,
            },
          });

          const installmentsToShift = currentBillingInstallments.filter((inst) => {
            if (!inst.transaction || inst.transaction.deletedAt) return false;
            const instDate = new Date(inst.transaction.date);
            instDate.setMonth(instDate.getMonth() + (inst.installmentNumber - 1));
            return instDate > closeDateNormalized;
          });

          if (installmentsToShift.length > 0) {
            await tx.transactionInstallment.updateMany({
              where: {
                id: { in: installmentsToShift.map((i) => i.id) },
              },
              data: {
                cardBillingId: targetNextBilling.id,
              },
            });

            const parentIds = Array.from(new Set(installmentsToShift.map((i) => i.transactionId)));
            await Promise.all(
              parentIds.map((txId) =>
                this.syncParentTransactionBillingFromFirstInstallment(txId, tx),
              ),
            );
          }
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const finalClosingDate = closeDateNormalized ?? (billing.periodEnd ? new Date(billing.periodEnd) : new Date(billing.periodStart));
      const finalPaymentDate = updateData.paymentDate ? new Date(updateData.paymentDate as Date) : (billing.paymentDate ? new Date(billing.paymentDate) : null);

      let newStatus: CardBillingStatus = CardBillingStatus.PENDING;
      if (billing.periodStart > today) {
        newStatus = CardBillingStatus.FUTURE;
      } else if (finalClosingDate < today) {
        if (finalPaymentDate && finalPaymentDate < today) {
          newStatus = CardBillingStatus.OVERDUE;
        } else {
          newStatus = CardBillingStatus.CLOSED;
        }
      }

      updateData.status = newStatus;

      const updatedBilling = await tx.cardBilling.update({
        where: { id: billingId },
        data: updateData,
      });

      if (newStatus !== billing.status) {
        await tx.cardBillingHistory.create({
          data: {
            cardBilling: { connect: { id: billing.id } },
            status: newStatus,
          },
        });
      }

      if (updateData.paymentDate && billing.paymentTransaction) {
        await tx.transaction.update({
          where: { id: billing.paymentTransaction.id },
          data: {
            date: updateData.paymentDate as Date,
            paymentLimit: updateData.paymentDate as Date,
          },
        });
      }

      await this.updatePaymentTransaction(billing.id, tx);
      
      const nextBillingObj = await tx.cardBilling.findFirst({
        where: {
          cardId: billing.cardId,
          periodStart: { gt: billing.periodStart },
        },
        orderBy: { periodStart: 'asc' },
      });
      if (nextBillingObj) {
        await this.updatePaymentTransaction(nextBillingObj.id, tx);
      }

      return updatedBilling;
    });
  }

  /**
   * Marks a billing as PAID and records a history entry.
   * Accepts an optional Prisma transaction client to run within an existing transaction.
   */
  async markBillingPaid(
    billingId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    await Promise.all([
      tx.cardBilling.update({
        where: { id: billingId },
        data: { status: CardBillingStatus.PAID },
      }),
      tx.cardBillingHistory.create({
        data: {
          cardBilling: { connect: { id: billingId } },
          status: CardBillingStatus.PAID,
        },
      }),
    ]);
  }

  async payBilling({
    billingId,
    userId,
    sourceAccountId,
    date = new Date(),
    description,
  }: {
    billingId: string;
    userId: string;
    sourceAccountId: string;
    date?: Date;
    description?: string;
  }): Promise<Transaction> {
    // Find the billing with payment transaction
    const billing = await this.prisma.cardBilling.findFirst({
      where: {
        id: billingId,
        card: {
          institutionLink: {
            userId,
          },
        },
      },
      include: {
        paymentTransaction: true,
      },
    });

    if (!billing) {
      throw new NotFoundException('Billing not found');
    }

    // Rejeitar pagamento para faturas PENDING ou já PAID
    if (billing.status === CardBillingStatus.PENDING) {
      throw new Error(
        'Não é possível pagar uma fatura que ainda não foi fechada.',
      );
    }

    if (billing.status === CardBillingStatus.PAID) {
      throw new Error('Esta fatura já foi paga.');
    }

    if (!billing.paymentTransaction) {
      throw new NotFoundException(
        'Payment transaction not found for this billing',
      );
    }

    // Update the payment transaction with the provided details
    return this.prisma.$transaction(async (tx) => {
      // Update the payment transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id: billing.paymentTransaction.id },
        data: {
          sourceAccount: { connect: { id: sourceAccountId } },
          date,
          ...(description && { description }),
          status: TransactionStatus.COMPLETED,
          paymentEnabled: true,
        },
        include: {
          sourceAccount: true,
          destinyAccount: true,
        },
      });

      // Update the billing status to PAID if it's CLOSED or OVERDUE
      if (
        billing.status === CardBillingStatus.CLOSED ||
        billing.status === CardBillingStatus.OVERDUE
      ) {
        await this.markBillingPaid(billingId, tx);
      }

      return updatedTransaction;
    });
  }

  // Daily at midnight - check for overdue billings and auto-pay completed billings
  @Cron('0 0 0 * * *')
  async checkBillingStatuses(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 0.0. Transition FUTURE billings that have started (periodStart <= today) -> PENDING
    const startedFutureBillings = await this.prisma.cardBilling.findMany({
      where: {
        status: CardBillingStatus.FUTURE,
        periodStart: { lte: today },
      },
    });

    for (const b of startedFutureBillings) {
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.cardBilling.update({
            where: { id: b.id },
            data: { status: CardBillingStatus.PENDING },
          });
          await tx.cardBillingHistory.create({
            data: {
              cardBilling: { connect: { id: b.id } },
              status: CardBillingStatus.PENDING,
            },
          });
        });
      } catch (err) {
        console.error(`Failed to transition future billing ${b.id} to pending:`, err);
      }
    }

    // 0. Auto-close PENDING billings that have expired (periodEnd < today)
    const expiredPendingBillings = await this.prisma.cardBilling.findMany({
      where: {
        status: CardBillingStatus.PENDING,
        periodEnd: { lt: today },
      },
    });
    for (const b of expiredPendingBillings) {
      try {
        await this.closeBillingInternal(b.id, undefined, b.periodEnd);
      } catch (err) {
        console.error(`Failed to auto-close billing ${b.id}:`, err);
      }
    }

    // 1. Find billings where payment transaction is COMPLETED -> mark as PAID
    const billingsToPay = await this.prisma.cardBilling.findMany({
      where: {
        status: { in: [CardBillingStatus.CLOSED, CardBillingStatus.OVERDUE] },
        paymentTransaction: {
          status: TransactionStatus.COMPLETED,
        },
      },
      include: {
        paymentTransaction: true,
      },
    });

    // Update to PAID and create history entries
    await Promise.all(
      billingsToPay.map((billing) => this.markBillingPaid(billing.id)),
    );

    // 2. Find CLOSED billings with paymentDate in the past -> mark as OVERDUE
    const overdueBillings = await this.prisma.cardBilling.findMany({
      where: {
        status: CardBillingStatus.CLOSED,
        paymentDate: { lt: today },
      },
    });

    // Update to OVERDUE and create history entries
    await Promise.all(
      overdueBillings.map((billing) =>
        this.prisma.$transaction([
          this.prisma.cardBilling.update({
            where: { id: billing.id },
            data: { status: CardBillingStatus.OVERDUE },
          }),
          this.prisma.cardBillingHistory.create({
            data: {
              cardBilling: { connect: { id: billing.id } },
              status: CardBillingStatus.OVERDUE,
            },
          }),
        ]),
      ),
    );
  }

  async calculateUnpaidBalance(cardId: string): Promise<Decimal> {
    const now = new Date();

    // 1. Sum simple transactions (no installments) on unpaid billings with date <= now and status != PLANNED
    const simpleTransactions = await this.prisma.transaction.aggregate({
      where: {
        sourceCardId: cardId,
        deletedAt: null,
        type: TransactionType.EXPENSE,
        status: { in: [TransactionStatus.COMPLETED, TransactionStatus.OVERDUE] },
        installments: { none: {} },
        cardBilling: {
          status: {
            in: [
              CardBillingStatus.FUTURE,
              CardBillingStatus.PENDING,
              CardBillingStatus.CLOSED,
              CardBillingStatus.OVERDUE,
            ],
          },
        },
        date: { lte: now },
      },
      _sum: {
        amount: true,
      },
    });

    // 2. Sum installments on unpaid billings with parent transaction status != PLANNED
    const installments = await this.prisma.transactionInstallment.aggregate({
      where: {
        transaction: {
          sourceCardId: cardId,
          deletedAt: null,
          type: TransactionType.EXPENSE,
          status: { in: [TransactionStatus.COMPLETED, TransactionStatus.OVERDUE] },
        },
        cardBilling: {
          status: {
            in: [
              CardBillingStatus.FUTURE,
              CardBillingStatus.PENDING,
              CardBillingStatus.CLOSED,
              CardBillingStatus.OVERDUE,
            ],
          },
        },
      },
      _sum: {
        amount: true,
      },
    });

    const simpleSum = simpleTransactions._sum.amount
      ? new Decimal(simpleTransactions._sum.amount)
      : new Decimal(0);
    const installmentsSum = installments._sum.amount
      ? new Decimal(installments._sum.amount)
      : new Decimal(0);

    return simpleSum.add(installmentsSum);
  }

  async calculateAvailableLimit(card: Card): Promise<Decimal> {
    const unpaidBalance = await this.calculateUnpaidBalance(card.id);
    return new Decimal(card.defaultLimit).minus(unpaidBalance);
  }

  async calculateUsagePercentage(card: Card): Promise<number> {
    const limit = new Decimal(card.defaultLimit);
    if (limit.isZero() || limit.isNegative()) {
      return 0;
    }
    const unpaidBalance = await this.calculateUnpaidBalance(card.id);
    return unpaidBalance.div(limit).mul(100).toNumber();
  }

  async calculateBillingTotalAmount(billingId: string): Promise<Decimal> {
    const simpleTransactions = await this.prisma.transaction.aggregate({
      where: {
        cardBillingId: billingId,
        deletedAt: null,
        installments: { none: {} },
      },
      _sum: { amount: true },
    });

    const installments = await this.prisma.transactionInstallment.aggregate({
      where: {
        cardBillingId: billingId,
        transaction: { deletedAt: null },
      },
      _sum: { amount: true },
    });

    const simpleSum = simpleTransactions._sum.amount
      ? new Decimal(simpleTransactions._sum.amount)
      : new Decimal(0);
    const installmentsSum = installments._sum.amount
      ? new Decimal(installments._sum.amount)
      : new Decimal(0);

    return simpleSum.add(installmentsSum);
  }
}

