import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
  }): Promise<AccountCard> {
    const card = await this.prisma.accountCard.findFirst({
      where: {
        id: cardId,
        account: {
          userId,
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.prisma.accountCard.update({
      where: { id: cardId },
      data: {
        ...(billingCycleDay !== undefined && { billingCycleDay }),
        ...(billingPaymentDay !== undefined && { billingPaymentDay }),
        ...(defaultLimit !== undefined && { defaultLimit }),
      },
    });
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

    const activeTransactions = billing?.transactions.filter(
      (t) => t.status !== TransactionStatus.CANCELED,
    );

    const totalAmount = activeTransactions?.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    return {
      ...billing,
      totalAmount,
      usagePercentage: totalAmount.div(billing?.limit).mul(100).toNumber(),
      transactionsCount: activeTransactions?.length ?? 0,
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

    let currentBilling = await this.prisma.cardBilling.findFirst({
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
          usagePercentage: [],
          transactionsCount: [],
        }),
        transactions: true,
      },
      orderBy: { periodStart: 'desc' },
    });

    // Se billingId foi passado mas não encontrado, buscar a fatura corrente
    if (!currentBilling && billingId) {
      currentBilling = await this.prisma.cardBilling.findFirst({
        where: {
          periodStart: { lte: new Date() },
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
            usagePercentage: [],
            transactionsCount: [],
          }),
          transactions: true,
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

    const activeTransactions = currentBilling?.transactions.filter(
      (t) => t.status !== TransactionStatus.CANCELED,
    );

    const totalAmount = activeTransactions?.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    return {
      billing: {
        ...currentBilling,
        totalAmount,
        usagePercentage: totalAmount
          .div(currentBilling?.limit)
          .mul(100)
          .toNumber(),
        transactionsCount: activeTransactions?.length ?? 0,
      },
      nextBillingId: nextBilling?.id,
      previousBillingId: previousBilling?.id,
    };
  }

  async updatePaymentTransaction(
    billingId: string,
  ): Promise<Transaction | null> {
    const billing = await this.prisma.cardBilling.findUnique({
      where: { id: billingId },
      include: {
        transactions: {
          where: {
            status: { not: TransactionStatus.CANCELED },
          },
        },
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

    if (!billing) {
      throw new NotFoundException('Card billing not found');
    }

    // Calcular total (apenas transações não canceladas)
    const totalAmount = billing.transactions.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    const existing = await this.prisma.transaction.findFirst({
      where: {
        billingPayment: {
          id: billingId,
        },
        type: TransactionType.BETWEEN_ACCOUNTS,
      },
    });

    // Se amount > 0 e transação não existe, criar
    if (totalAmount.greaterThan(0) && !existing) {
      return this.prisma.transaction.create({
        data: {
          amount: totalAmount,
          date: billing.paymentDate,
          description: `Pagamento - Fatura ${format(billing.periodStart, 'MM/yyyy')} - Cartão ${billing.accountCard.account.institution.name}`,
          status: TransactionStatus.PLANNED,
          type: TransactionType.BETWEEN_ACCOUNTS,
          paymentEnabled: false,
          paymentLimit: billing.paymentDate,
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
      });
    }

    // Se amount > 0 e transação existe, atualizar
    if (totalAmount.greaterThan(0) && existing) {
      return this.prisma.transaction.update({
        where: { id: existing.id },
        data: { amount: totalAmount },
      });
    }

    // Se amount == 0 e transação existe, desassociar do billing e deletar
    if (totalAmount.equals(0) && existing) {
      // Primeiro desassociar do billingPayment
      await this.prisma.transaction.update({
        where: { id: existing.id },
        data: { billingPayment: { disconnect: true } },
      });
      // Depois deletar
      await this.prisma.transaction.delete({
        where: { id: existing.id },
      });
    }

    // Se amount == 0, verificar se a fatura pode ser deletada
    if (totalAmount.equals(0)) {
      // Buscar a fatura corrente (primeira com periodStart <= hoje)
      const today = new Date();
      const currentBilling = await this.prisma.cardBilling.findFirst({
        where: {
          accountCardId: billing.accountCard.id,
          periodStart: { lte: today },
        },
        orderBy: { periodStart: 'desc' },
        select: { id: true },
      });

      // Se não é a fatura corrente e não tem transações ativas, deletar
      if (currentBilling?.id !== billing.id) {
        // Verificar se realmente não tem transações ativas
        const activeTransactionsCount = await this.prisma.transaction.count({
          where: {
            cardBillingId: billing.id,
            status: { not: TransactionStatus.CANCELED },
          },
        });

        if (activeTransactionsCount === 0) {
          await this.prisma.cardBilling.delete({
            where: { id: billing.id },
          });
        }
      }

      return null;
    }

    return null;
  }

  async createBilling({
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
  }): Promise<CardBilling> {
    // Calcular o início correto do período baseado no dia de fechamento
    // O período começa no dia seguinte ao fechamento do ciclo anterior
    const calculatedPeriodStart = new Date(periodStart);
    const periodEnd = new Date(periodStart);
    const paymentDate = new Date(periodStart);

    // Se a data está antes ou no dia de fechamento, pertence ao ciclo atual
    // Se está depois, pertence ao próximo ciclo
    if (periodStart.getDate() <= cardBillingCycleDay) {
      // A transação está no ciclo atual
      // periodStart deve ser o dia após o fechamento do mês anterior
      calculatedPeriodStart.setMonth(calculatedPeriodStart.getMonth() - 1);
      calculatedPeriodStart.setDate(cardBillingCycleDay + 1);

      periodEnd.setDate(cardBillingCycleDay);
      periodEnd.setHours(23 + 3, 59, 59, 999);
    } else {
      // A transação está no próximo ciclo
      // periodStart é o dia após o fechamento do mês atual
      calculatedPeriodStart.setDate(cardBillingCycleDay + 1);

      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(cardBillingCycleDay);
      periodEnd.setHours(23 + 3, 59, 59, 999);
    }

    // Calcular data de pagamento
    if (periodStart.getDate() > cardBillingPaymentDay) {
      paymentDate.setMonth(paymentDate.getMonth() + 1);
    }
    paymentDate.setDate(cardBillingPaymentDay);
    paymentDate.setHours(23 + 3, 59, 59, 999);

    const billing = await this.prisma.cardBilling.create({
      data: {
        accountCard: {
          connect: {
            id: cardId,
          },
        },
        periodStart: calculatedPeriodStart,
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

    // Criar apenas o histórico da fatura
    // A transação de pagamento será criada automaticamente pelo updatePaymentTransaction
    // quando a primeira despesa for adicionada à fatura
    await this.prisma.cardBillingHistory.create({
      data: {
        cardBilling: {
          connect: {
            id: billing.id,
          },
        },
        status: CardBillingStatus.PENDING,
      },
    });

    return billing;
  }

  async closeBilling({
    billingId,
    userId,
    closingDate = new Date(),
  }: {
    billingId: string;
    userId: string;
    closingDate?: Date;
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
        transactions: true,
      },
    });

    if (!billing) {
      throw new NotFoundException('Billing not found or already closed');
    }

    // Normalize closing date to end of day
    const closeDateNormalized = new Date(closingDate);
    closeDateNormalized.setHours(23, 59, 59, 999);

    // Separate transactions: those within the closing period vs those after
    const transactionsInBilling = billing.transactions.filter(
      (t) => new Date(t.date) <= closeDateNormalized,
    );
    const transactionsForNextBilling = billing.transactions.filter(
      (t) => new Date(t.date) > closeDateNormalized,
    );

    // Calculate billing total (only transactions within period)
    const billingTotal = transactionsInBilling.reduce(
      (acc, t) => acc.add(t.amount),
      new Decimal(0),
    );

    // Create next billing cycle
    const nextPeriodStart = new Date(closeDateNormalized);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 1);
    nextPeriodStart.setHours(0, 0, 0, 0);

    const nextBilling = await this.createBilling({
      cardId: billing.accountCardId,
      cardBillingCycleDay: billing.accountCard.billingCycleDay,
      cardBillingPaymentDay: billing.accountCard.billingPaymentDay,
      periodStart: nextPeriodStart,
      limit: billing.accountCard.defaultLimit,
    });

    // Move transactions after closing date to new billing
    if (transactionsForNextBilling.length > 0) {
      await this.prisma.transaction.updateMany({
        where: {
          id: { in: transactionsForNextBilling.map((t) => t.id) },
        },
        data: {
          cardBillingId: nextBilling.id,
        },
      });
    }

    // Garantir que a transação de pagamento existe e atualizar com o valor correto
    // (updatePaymentTransaction cria se não existir)
    const paymentTransaction = await this.updatePaymentTransaction(billingId);

    // Se a transação existe, habilitar para pagamento
    if (paymentTransaction) {
      await this.prisma.transaction.update({
        where: { id: paymentTransaction.id },
        data: { paymentEnabled: true },
      });
    }

    // Close current billing with actual period end
    return this.prisma.cardBilling.update({
      where: { id: billingId },
      data: {
        status: CardBillingStatus.CLOSED,
        periodEnd: closeDateNormalized,
      },
    });
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
        accountCard: {
          account: {
            user: { id: userId },
          },
        },
      },
      include: {
        paymentTransaction: true,
        accountCard: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!billing) {
      throw new NotFoundException('Billing not found');
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

      // Update the billing status to PAID if it's currently CLOSED
      if (billing.status === CardBillingStatus.CLOSED) {
        await Promise.all([
          tx.cardBilling.update({
            where: { id: billingId },
            data: { status: CardBillingStatus.PAID },
          }),
          // Add history entry for the payment
          tx.cardBillingHistory.create({
            data: {
              cardBilling: { connect: { id: billingId } },
              status: CardBillingStatus.PAID,
            },
          }),
        ]);
      }

      return updatedTransaction;
    });
  }

  // Daily at midnight - check for overdue billings
  @Cron('0 0 0 * * *')
  async checkOverdueBillings(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find CLOSED billings with paymentDate in the past
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
}
