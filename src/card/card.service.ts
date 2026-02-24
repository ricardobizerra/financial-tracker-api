import { Injectable, NotFoundException } from '@nestjs/common';
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

  async find(where: Prisma.CardWhereUniqueInput): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({
      where,
    });

    return card;
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
        institutionConnection: {
          userId,
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return this.prisma.card.update({
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
        installments: {
          include: {
            transaction: true,
          },
        },
        card: {
          include: {
            institutionConnection: {
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

    // Somar transações normais
    const transactionsTotal = activeTransactions?.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    // Somar installments (parcelas) - apenas de transações não canceladas
    const installmentsTotal =
      billing?.installments
        ?.filter((i) => i.transaction?.status !== TransactionStatus.CANCELED)
        .reduce(
          (acc, installment) => acc.add(installment.amount),
          new Decimal(0),
        ) ?? new Decimal(0);

    const totalAmount = transactionsTotal.add(installmentsTotal);

    const installmentsCount =
      billing?.installments?.filter(
        (i) => i.transaction?.status !== TransactionStatus.CANCELED,
      ).length ?? 0;

    return {
      ...billing,
      totalAmount,
      usagePercentage: totalAmount.div(billing?.limit).mul(100).toNumber(),
      transactionsCount: (activeTransactions?.length ?? 0) + installmentsCount,
    };
  }

  async findCurrentBilling(
    queriedFields: (keyof CardBillingOnDate)[],
    cardId: string,
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
        card: {
          id: cardId,
          institutionConnection: {
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
        transactions: true,
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
            institutionConnection: {
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
          transactions: true,
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
                institutionConnection: {
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
                institutionConnection: {
                  userId,
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

    // Soma transações normais
    const transactionsTotal = activeTransactions?.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    // Soma installments (parcelas) - apenas de transações não canceladas
    const installmentsTotal =
      currentBilling?.installments
        ?.filter((i) => i.transaction?.status !== TransactionStatus.CANCELED)
        .reduce(
          (acc, installment) => acc.add(installment.amount),
          new Decimal(0),
        ) ?? new Decimal(0);

    const totalAmount = transactionsTotal.add(installmentsTotal);

    const installmentsCount =
      currentBilling?.installments?.filter(
        (i) => i.transaction?.status !== TransactionStatus.CANCELED,
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
  ): Promise<TransactionModel[]> {
    const billing = await this.prisma.cardBilling.findFirst({
      where: {
        id: billingId,
        card: {
          institutionConnection: {
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
                institutionConnection: { include: { institution: true } },
              },
            },
            destinyAccount: {
              include: {
                institutionConnection: { include: { institution: true } },
              },
            },
            cardBilling: true,
          },
          where: {
            status: {
              not: TransactionStatus.CANCELED,
            },
          },
        },
        // Parcelas (installments) vinculadas ao billing
        installments: {
          include: {
            transaction: {
              include: {
                sourceAccount: {
                  include: {
                    institutionConnection: { include: { institution: true } },
                  },
                },
                destinyAccount: {
                  include: {
                    institutionConnection: { include: { institution: true } },
                  },
                },
                cardBilling: true,
                installments: true, // Para contar total de parcelas
              },
            },
          },
          where: {
            transaction: {
              status: {
                not: TransactionStatus.CANCELED,
              },
            },
          },
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
      if (!installment.transaction) continue;

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
  ): Promise<Transaction | null> {
    const billing = await this.prisma.cardBilling.findUnique({
      where: { id: billingId },
      include: {
        transactions: {
          where: {
            status: { not: TransactionStatus.CANCELED },
          },
        },
        installments: {
          include: {
            transaction: true,
          },
        },
        card: {
          include: {
            institutionConnection: {
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

    // Calcular total de transações normais (apenas não canceladas)
    const transactionsTotal = billing.transactions.reduce(
      (acc, transaction) => acc.add(transaction.amount),
      new Decimal(0),
    );

    // Calcular total de installments (parcelas) - apenas de transações não canceladas
    const installmentsTotal = billing.installments
      .filter((i) => i.transaction?.status !== TransactionStatus.CANCELED)
      .reduce(
        (acc, installment) => acc.add(installment.amount),
        new Decimal(0),
      );

    const totalAmount = transactionsTotal.add(installmentsTotal);

    const existing = await this.prisma.transaction.findFirst({
      where: {
        billingPayment: {
          id: billingId,
        },
        type: TransactionType.EXPENSE,
      },
    });

    // Se amount > 0 e transação não existe, criar
    if (totalAmount.greaterThan(0) && !existing) {
      return this.prisma.transaction.create({
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
              id: billing.card.institutionConnection.user.id,
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
          cardId: billing.card.id,
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

    // Se a data está antes ou no dia de fechamento, pertence ao ciclo atual
    // Se está depois, pertence ao próximo ciclo
    if (periodStart.getDate() <= cardBillingCycleDay) {
      // A transação está no ciclo atual
      // periodStart deve ser o dia após o fechamento do mês anterior
      calculatedPeriodStart.setMonth(calculatedPeriodStart.getMonth() - 1);
      calculatedPeriodStart.setDate(cardBillingCycleDay + 1);

      periodEnd.setDate(cardBillingCycleDay);
      periodEnd.setHours(23, 59, 59, 999);
    } else {
      // A transação está no próximo ciclo
      // periodStart é o dia após o fechamento do mês atual
      calculatedPeriodStart.setDate(cardBillingCycleDay + 1);

      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(cardBillingCycleDay);
      periodEnd.setHours(23, 59, 59, 999);
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
    paymentDate.setHours(23, 59, 59, 999);

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
        status: CardBillingStatus.PENDING,
        limit,
      },
      include: {
        card: {
          include: {
            institutionConnection: {
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
        card: {
          institutionConnection: {
            userId,
          },
        },
        status: CardBillingStatus.PENDING,
      },
      include: {
        card: {
          include: {
            institutionConnection: true,
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
      cardId: billing.cardId,
      cardBillingCycleDay: billing.card.billingCycleDay,
      cardBillingPaymentDay: billing.card.billingPaymentDay,
      periodStart: nextPeriodStart,
      limit: billing.card.defaultLimit,
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
        card: {
          institutionConnection: {
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

  // Daily at midnight - check for overdue billings and auto-pay completed billings
  @Cron('0 0 0 * * *')
  async checkBillingStatuses(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
      billingsToPay.map((billing) =>
        this.prisma.$transaction([
          this.prisma.cardBilling.update({
            where: { id: billing.id },
            data: { status: CardBillingStatus.PAID },
          }),
          this.prisma.cardBillingHistory.create({
            data: {
              cardBilling: { connect: { id: billing.id } },
              status: CardBillingStatus.PAID,
            },
          }),
        ]),
      ),
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
}
