import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  Transaction,
  TransactionCreateInput,
} from '@/lib/graphql/prisma-client';
import {
  Prisma,
  TransactionType,
  TransactionStatus,
  CardBillingStatus,
  AccountType,
} from '@prisma/client';
import {
  TransactionModel,
  OrdenationTransactionArgs,
  TransactionFilterArgs,
  CancelCheckInfo,
} from './transaction.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  private buildWhereClause({
    userId,
    filterArgs,
    searchArgs,
  }: {
    userId: string;
    filterArgs: TransactionFilterArgs;
    searchArgs: SearchArgs;
  }): Prisma.TransactionWhereInput {
    return {
      userId,
      ...(filterArgs.accountId && {
        OR: [
          { sourceAccountId: filterArgs.accountId },
          { destinyAccountId: filterArgs.accountId },
        ],
      }),
      ...(filterArgs.cardBillingId && {
        cardBillingId: filterArgs.cardBillingId,
      }),
      ...(filterArgs.startDate && {
        date: {
          gte: filterArgs.startDate,
          ...(filterArgs.endDate && { lte: filterArgs.endDate }),
        },
      }),
      ...(!filterArgs.startDate &&
        filterArgs.endDate && {
          date: { lte: filterArgs.endDate },
        }),
      ...(filterArgs.types &&
        filterArgs.types.length > 0 && {
          type: { in: filterArgs.types },
        }),
      ...(filterArgs.statuses &&
        filterArgs.statuses.length > 0 && {
          status: { in: filterArgs.statuses },
        }),
      ...(searchArgs.search && {
        OR: ['name', 'description'].map((field) => ({
          [field]: {
            contains: searchArgs.search,
            mode: 'insensitive',
          },
        })),
      }),
    };
  }

  async findMany({
    filterArgs,
    userId,
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
  }: {
    filterArgs: TransactionFilterArgs;
    userId: string;
    queriedFields: (keyof TransactionModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationTransactionArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const whereClause = this.buildWhereClause({
      userId,
      filterArgs,
      searchArgs,
    });

    const transactionsLengthQuery = last
      ? await this.prismaService.transaction.count({
          where: whereClause,
        })
      : undefined;

    const transactionsLength = !!transactionsLengthQuery
      ? Number(transactionsLengthQuery)
      : undefined;

    // Determinar quais campos "computados" foram solicitados
    const cancelFields = ['canCancel', 'cancelReason', 'cancelWarningMessage'];
    const installmentFields = ['installments', 'installmentStartDate'];
    const needsCancelInfo = queriedFields.some((f) =>
      cancelFields.includes(f as string),
    );
    const needsInstallments = queriedFields.some((f) =>
      installmentFields.includes(f as string),
    );

    const transactions = await this.prismaService.transaction.findMany({
      take: last
        ? unbufferedCursor
          ? last
          : transactionsLength % last === 0
            ? last
            : transactionsLength % last
        : first
          ? first
          : undefined,
      skip: unbufferedCursor
        ? last
          ? transactionsLength - unbufferedCursor + 1
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
      // Excluir campos virtuais que são computados no service
      select: {
        ...selectObject<Transaction, TransactionModel>(
          queriedFields.filter(
            (field) =>
              ![
                'canCancel',
                'cancelReason',
                'cancelWarningMessage',
                'installmentStartDate',
                'installments',
              ].includes(field as string),
          ) as (keyof TransactionModel)[],
          {
            canCancel: ['status'],
            cancelReason: ['status'],
            cancelWarningMessage: ['status'],
            installmentStartDate: ['recurringTransactionId'],
            installmentNumber: ['installments'],
            totalInstallments: ['installments'],
            installmentId: ['installments'],
          },
        ),
        // Sempre incluir id e status para cancelInfo
        id: true,
        status: true,
        // Incluir relações necessárias para cancelInfo
        ...(needsCancelInfo && {
          cardBilling: { select: { status: true } },
          sourceAccount: { select: { type: true } },
        }),
        // Incluir installments se necessário (evita N+1)
        ...((needsInstallments || needsCancelInfo) && {
          installments: {
            include: {
              cardBilling: { select: { status: true, periodStart: true } },
            },
            orderBy: { installmentNumber: 'asc' as const },
          },
        }),
      },
      where: whereClause,
    });

    if (last) {
      transactions.reverse();
    }

    if (transactions.length === 0) {
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

    // Processar transações e anexar dados computados
    const processedTransactions = transactions.map((transaction: any) => {
      const txWithExtras = transaction;
      const installments = transaction.installments || [];

      // Computar installmentStartDate se solicitado
      if (needsInstallments) {
        const firstInstallment = installments.find(
          (i: any) => i.installmentNumber === 1,
        );
        if (firstInstallment) {
          txWithExtras.installmentStartDate =
            firstInstallment.cardBilling?.periodStart ?? transaction.date;
        }
      }

      // Computar cancelInfo e popular campos diretamente
      if (needsCancelInfo) {
        const cancelInfo = this.computeCancelInfo(
          transaction as any,
          installments,
        );
        txWithExtras.canCancel = cancelInfo.canCancel;
        txWithExtras.cancelReason = cancelInfo.reason;
        txWithExtras.cancelWarningMessage = cancelInfo.warningMessage;
      }

      return txWithExtras as TransactionModel;
    });

    const edges = processedTransactions.map((transaction, index) => {
      const cursorIndex =
        index +
        1 +
        (last
          ? unbufferedCursor
            ? unbufferedCursor - last - 1
            : transactionsLength - transactions.length
          : unbufferedCursor || 0);

      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      return {
        cursor: bufferedCursor,
        node: transaction,
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
      ? await this.prismaService.transaction.findFirst({
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
          select: {
            id: true,
          },
          where: whereClause,
        })
      : undefined;

    const hasNextPage = last ? !!before : !!extraItem;

    const hasPreviousPage = last ? !!extraItem : !!after;

    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    };

    return {
      edges,
      pageInfo,
    };
  }

  async getSummary({
    userId,
    filterArgs,
    searchArgs,
  }: {
    userId: string;
    filterArgs: TransactionFilterArgs;
    searchArgs: SearchArgs;
  }) {
    const whereClause = this.buildWhereClause({
      userId,
      filterArgs,
      searchArgs,
    });

    // Agregação por tipo e status para calcular realized/forecast
    const aggregations = await this.prismaService.transaction.groupBy({
      by: ['type', 'status'],
      where: whereClause,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Totais legados (mantidos para compatibilidade)
    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;

    // Saldo Realizado (apenas COMPLETED)
    let realizedIncome = 0;
    let realizedExpense = 0;

    // Saldo Previsto (COMPLETED + PLANNED + OVERDUE, exclui CANCELED)
    let forecastIncome = 0;
    let forecastExpense = 0;

    for (const agg of aggregations) {
      const amount = Number(agg._sum.amount || 0);
      const count = agg._count.id;
      const isCompleted = agg.status === TransactionStatus.COMPLETED;
      const isForecastable =
        agg.status === TransactionStatus.COMPLETED ||
        agg.status === TransactionStatus.PLANNED ||
        agg.status === TransactionStatus.OVERDUE;

      if (agg.type === TransactionType.INCOME) {
        totalIncome += amount;
        if (isCompleted) realizedIncome += amount;
        if (isForecastable) forecastIncome += amount;
      } else if (agg.type === TransactionType.EXPENSE) {
        totalExpense += amount;
        if (isCompleted) realizedExpense += amount;
        if (isForecastable) forecastExpense += amount;
      }

      transactionCount += count;
    }

    return {
      // Legacy
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,
      // Realized
      realizedIncome,
      realizedExpense,
      realizedBalance: realizedIncome - realizedExpense,
      // Forecast
      forecastIncome,
      forecastExpense,
      forecastBalance: forecastIncome - forecastExpense,
    };
  }

  /**
   * Computa informações de cancelamento para uma transação.
   * Usa dados pré-carregados (installments, cardBilling, sourceAccount) para evitar N+1.
   */
  computeCancelInfo(
    transaction: {
      id: string;
      status: TransactionStatus;
      cardBilling?: { status: CardBillingStatus } | null;
      sourceAccount?: { type: AccountType } | null;
    },
    installments: Array<{
      installmentNumber: number;
      cardBilling?: { status: CardBillingStatus } | null;
    }>,
  ): CancelCheckInfo {
    // Se já está cancelada, não pode cancelar novamente
    if (transaction.status === TransactionStatus.CANCELED) {
      return {
        canCancel: false,
        reason: 'Transação já cancelada',
        warningMessage: null,
      };
    }

    // Se é uma transação parcelada (tem installments associados)
    if (installments.length > 0) {
      const firstInstallment = installments.find(
        (i) => i.installmentNumber === 1,
      );

      if (firstInstallment?.cardBilling) {
        const closedStatuses: CardBillingStatus[] = [
          CardBillingStatus.PAID,
          CardBillingStatus.CLOSED,
          CardBillingStatus.COMPLETED,
        ];
        if (closedStatuses.includes(firstInstallment.cardBilling.status)) {
          return {
            canCancel: false,
            reason: 'A primeira parcela está em uma fatura fechada ou paga',
            warningMessage: null,
          };
        }
      }

      return {
        canCancel: true,
        reason: null,
        warningMessage: `Ao cancelar esta transação, todas as ${installments.length} parcelas serão canceladas.`,
      };
    }

    // Transação única - verificar status e fatura
    const allowedStatuses: TransactionStatus[] = [
      TransactionStatus.PLANNED,
      TransactionStatus.OVERDUE,
    ];

    if (
      !allowedStatuses.includes(transaction.status) &&
      transaction.sourceAccount?.type !== AccountType.CREDIT_CARD
    ) {
      return {
        canCancel: false,
        reason: 'Apenas transações pendentes podem ser canceladas',
        warningMessage: null,
      };
    }

    if (transaction.cardBilling) {
      const closedStatuses: CardBillingStatus[] = [
        CardBillingStatus.PAID,
        CardBillingStatus.CLOSED,
        CardBillingStatus.COMPLETED,
      ];
      if (closedStatuses.includes(transaction.cardBilling.status)) {
        return {
          canCancel: false,
          reason: 'Transação está em uma fatura fechada ou paga',
          warningMessage: null,
        };
      }
    }

    return { canCancel: true, reason: null, warningMessage: null };
  }

  async find(
    where: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction | null> {
    return this.prismaService.transaction.findUnique({
      where,
    });
  }

  async create(data: TransactionCreateInput) {
    return this.prismaService.transaction.create({ data });
  }

  async update(id: string, data: Prisma.TransactionUpdateInput) {
    return this.prismaService.transaction.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prismaService.transaction.delete({ where: { id } });
  }

  async getBalanceForecast({
    userId,
    accountId,
    startDate,
    endDate,
    initialBalance,
  }: {
    userId: string;
    accountId?: string;
    startDate: Date;
    endDate: Date;
    initialBalance: number;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar todas as transações no período
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
        ...(accountId && {
          OR: [{ sourceAccountId: accountId }, { destinyAccountId: accountId }],
        }),
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'CANCELED',
        },
      },
      select: {
        id: true,
        date: true,
        amount: true,
        type: true,
        status: true,
        description: true,
        sourceAccountId: true,
        destinyAccountId: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Agrupar transações por dia
    const transactionsByDate = new Map<string, typeof transactions>();

    transactions.forEach((tx) => {
      const dateKey = tx.date.toISOString().split('T')[0];
      const existing = transactionsByDate.get(dateKey) || [];
      existing.push(tx);
      transactionsByDate.set(dateKey, existing);
    });

    // Gerar pontos do gráfico dia a dia
    const dataPoints: {
      date: Date;
      balance: number;
      isProjected: boolean;
      incomeAmount: number;
      expenseAmount: number;
      transactionCount: number;
      transactions: {
        id: string;
        description: string;
        amount: number;
        type: string;
        isIncome: boolean;
      }[];
    }[] = [];

    let runningBalance = initialBalance;
    const currentDate = new Date(startDate);
    let currentBalance = initialBalance;
    let projectedBalance = initialBalance;

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayTransactions = transactionsByDate.get(dateKey) || [];
      const isProjected = currentDate > today;

      let incomeAmount = 0;
      let expenseAmount = 0;

      const dayTxList: {
        id: string;
        description: string;
        amount: number;
        type: string;
        isIncome: boolean;
      }[] = [];

      dayTransactions.forEach((tx) => {
        // Para projeções, incluir apenas transações agendadas
        if (isProjected && tx.status === 'COMPLETED') return;
        // Para histórico, incluir apenas transações completadas
        if (!isProjected && tx.status !== 'COMPLETED') return;

        const amount = Number(tx.amount);
        let included = false;
        let isIncome = false;

        if (tx.type === TransactionType.INCOME) {
          if (!accountId || tx.destinyAccountId === accountId) {
            runningBalance += amount;
            incomeAmount += amount;
            included = true;
            isIncome = true;
          }
        } else if (tx.type === TransactionType.EXPENSE) {
          if (!accountId || tx.sourceAccountId === accountId) {
            runningBalance -= amount;
            expenseAmount += amount;
            included = true;
            isIncome = false;
          }
        } else if (tx.type === TransactionType.BETWEEN_ACCOUNTS && accountId) {
          if (tx.destinyAccountId === accountId) {
            runningBalance += amount;
            incomeAmount += amount;
            included = true;
            isIncome = true;
          }
          if (tx.sourceAccountId === accountId) {
            runningBalance -= amount;
            expenseAmount += amount;
            included = true;
            isIncome = false;
          }
        }

        if (included) {
          dayTxList.push({
            id: tx.id,
            description: tx.description || 'Sem descrição',
            amount,
            type: tx.type,
            isIncome,
          });
        }
      });

      dataPoints.push({
        date: new Date(currentDate),
        balance: runningBalance,
        isProjected,
        incomeAmount,
        expenseAmount,
        transactionCount: dayTxList.length,
        transactions: dayTxList,
      });

      // Guardar saldo atual e projetado
      if (
        currentDate.toISOString().split('T')[0] ===
        today.toISOString().split('T')[0]
      ) {
        currentBalance = runningBalance;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    projectedBalance = runningBalance;

    return {
      dataPoints,
      currentBalance,
      projectedBalance,
      balanceTrend: projectedBalance - currentBalance,
      startDate,
      endDate,
    };
  }

  async getTransactionsCalendar({
    userId,
    accountId,
    year,
    month,
  }: {
    userId: string;
    accountId?: string;
    year: number;
    month: number;
  }) {
    // Calcular primeiro e último dia do mês
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
        ...(accountId && {
          OR: [{ sourceAccountId: accountId }, { destinyAccountId: accountId }],
        }),
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'CANCELED',
        },
      },
      select: {
        id: true,
        description: true,
        amount: true,
        type: true,
        status: true,
        date: true,
        sourceAccountId: true,
        destinyAccountId: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Agrupar por dia
    const transactionsByDate = new Map<string, typeof transactions>();
    transactions.forEach((tx) => {
      const dateKey = tx.date.toISOString().split('T')[0];
      const existing = transactionsByDate.get(dateKey) || [];
      existing.push(tx);
      transactionsByDate.set(dateKey, existing);
    });

    // Gerar dias do mês
    const days: {
      date: Date;
      totalIncome: number;
      totalExpense: number;
      transactionCount: number;
      transactions: {
        id: string;
        description: string;
        amount: number;
        type: string;
        status: string;
      }[];
    }[] = [];

    let monthTotalIncome = 0;
    let monthTotalExpense = 0;

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayTransactions = transactionsByDate.get(dateKey) || [];

      let dayIncome = 0;
      let dayExpense = 0;
      const txList: {
        id: string;
        description: string;
        amount: number;
        type: string;
        status: string;
      }[] = [];

      dayTransactions.forEach((tx) => {
        const amount = Number(tx.amount);
        const isIncome =
          tx.type === TransactionType.INCOME ||
          (tx.type === TransactionType.BETWEEN_ACCOUNTS &&
            accountId &&
            tx.destinyAccountId === accountId);
        const isExpense =
          tx.type === TransactionType.EXPENSE ||
          (tx.type === TransactionType.BETWEEN_ACCOUNTS &&
            accountId &&
            tx.sourceAccountId === accountId);

        if (isIncome) {
          dayIncome += amount;
        }
        if (isExpense) {
          dayExpense += amount;
        }

        txList.push({
          id: tx.id,
          description: tx.description || 'Sem descrição',
          amount,
          type: tx.type,
          status: tx.status,
        });
      });

      if (txList.length > 0) {
        days.push({
          date: new Date(currentDate),
          totalIncome: dayIncome,
          totalExpense: dayExpense,
          transactionCount: txList.length,
          transactions: txList,
        });
      }

      monthTotalIncome += dayIncome;
      monthTotalExpense += dayExpense;

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      days,
      monthTotalIncome,
      monthTotalExpense,
      monthBalance: monthTotalIncome - monthTotalExpense,
    };
  }

  async getFinancialAgenda({
    userId,
    accountId,
    daysAhead,
  }: {
    userId: string;
    accountId?: string;
    daysAhead: number;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysAhead);

    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
        ...(accountId && {
          OR: [{ sourceAccountId: accountId }, { destinyAccountId: accountId }],
        }),
        date: {
          gte: today,
          lte: endDate,
        },
        status: {
          notIn: ['COMPLETED', 'CANCELED'],
        },
      },
      select: {
        id: true,
        description: true,
        amount: true,
        type: true,
        status: true,
        date: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calcular dias até vencimento e agrupar
    const thisWeek: typeof transactions = [];
    const nextWeek: typeof transactions = [];
    const thisMonth: typeof transactions = [];
    const later: typeof transactions = [];

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      const daysUntil = Math.ceil(
        (tx.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      const amount = Number(tx.amount);

      if (tx.type === TransactionType.INCOME) {
        totalIncome += amount;
      } else if (tx.type === TransactionType.EXPENSE) {
        totalExpense += amount;
      }

      if (daysUntil <= 7) {
        thisWeek.push(tx);
      } else if (daysUntil <= 14) {
        nextWeek.push(tx);
      } else if (daysUntil <= 30) {
        thisMonth.push(tx);
      } else {
        later.push(tx);
      }
    });

    const mapTransactions = (txs: typeof transactions) =>
      txs.map((tx) => {
        const daysUntilDue = Math.ceil(
          (tx.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        return {
          id: tx.id,
          description: tx.description || 'Sem descrição',
          amount: Number(tx.amount),
          type: tx.type,
          status: tx.status,
          date: tx.date,
          daysUntilDue,
          isOverdue: daysUntilDue < 0,
        };
      });

    const groups: {
      label: string;
      transactions: ReturnType<typeof mapTransactions>;
    }[] = [];

    if (thisWeek.length > 0) {
      groups.push({
        label: 'Esta semana',
        transactions: mapTransactions(thisWeek),
      });
    }
    if (nextWeek.length > 0) {
      groups.push({
        label: 'Próxima semana',
        transactions: mapTransactions(nextWeek),
      });
    }
    if (thisMonth.length > 0) {
      groups.push({
        label: 'Este mês',
        transactions: mapTransactions(thisMonth),
      });
    }
    if (later.length > 0) {
      groups.push({
        label: 'Mais tarde',
        transactions: mapTransactions(later),
      });
    }

    return {
      groups,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      pendingCount: transactions.length,
    };
  }

  async getTransactionsGroupedByPeriod({
    userId,
    accountId,
    limitPerGroup = 10,
    startDate,
    endDate,
    types,
    statuses,
  }: {
    userId: string;
    accountId?: string;
    limitPerGroup?: number;
    startDate?: Date;
    endDate?: Date;
    types?: TransactionType[];
    statuses?: TransactionStatus[];
  }) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );
    const endOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0,
    );

    // Definir filtro de status (excluir CANCELED a menos que explicitamente solicitado)
    const statusFilter =
      statuses && statuses.length > 0
        ? { in: statuses }
        : { not: TransactionStatus.CANCELED };

    // Buscar transações com filtros aplicados
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
        status: statusFilter,
        ...(accountId && {
          OR: [{ sourceAccountId: accountId }, { destinyAccountId: accountId }],
        }),
        ...(startDate && { date: { gte: startDate } }),
        ...(endDate && { date: { lte: endDate } }),
        ...(types && types.length > 0 && { type: { in: types } }),
      },
      orderBy: { date: 'asc' },
      include: {
        sourceAccount: { include: { institution: true } },
        destinyAccount: { include: { institution: true } },
        billingPayment: {
          include: {
            accountCard: {
              include: { account: { include: { institution: true } } },
            },
          },
        },
        cardBilling: {
          include: {
            paymentTransaction: true,
          },
        },
        installments: {
          include: {
            cardBilling: { select: { status: true } },
          },
          orderBy: { installmentNumber: 'asc' as const },
        },
      },
    });

    // Quando filtrando por conta, transformar BETWEEN_ACCOUNTS para INCOME/EXPENSE
    // baseado na perspectiva da conta
    // Também computar cancelInfo para cada transação
    const transformedTransactions = transactions.map((tx) => {
      const cancelInfo = this.computeCancelInfo(
        {
          id: tx.id,
          status: tx.status,
          cardBilling: tx.cardBilling,
          sourceAccount: tx.sourceAccount,
        },
        tx.installments,
      );

      let transformedType = tx.type;
      if (accountId && tx.type === TransactionType.BETWEEN_ACCOUNTS) {
        // Se a conta é destino, aparece como INCOME
        if (tx.destinyAccountId === accountId) {
          transformedType = TransactionType.INCOME;
        }
        // Se a conta é origem, aparece como EXPENSE
        if (tx.sourceAccountId === accountId) {
          transformedType = TransactionType.EXPENSE;
        }
      }

      return {
        ...tx,
        type: transformedType,
        totalInstallments: tx.installments.length,
        canCancel: cancelInfo.canCancel,
        cancelReason: cancelInfo.reason,
        cancelWarningMessage: cancelInfo.warningMessage,
      };
    });

    type PeriodKey =
      | 'OVERDUE'
      | 'TODAY'
      | 'THIS_WEEK'
      | 'THIS_MONTH'
      | 'NEXT_MONTH'
      | 'FUTURE'
      | 'PAST';

    const groups: Record<PeriodKey, typeof transactions> = {
      OVERDUE: [],
      TODAY: [],
      THIS_WEEK: [],
      THIS_MONTH: [],
      NEXT_MONTH: [],
      FUTURE: [],
      PAST: [],
    };

    const labels: Record<PeriodKey, string> = {
      OVERDUE: 'Atrasadas',
      TODAY: 'Hoje',
      THIS_WEEK: 'Esta semana',
      THIS_MONTH: 'Este mês',
      NEXT_MONTH: 'Próximo mês',
      FUTURE: 'Futuro',
      PAST: 'Passadas',
    };

    for (const tx of transformedTransactions) {
      const txDate = new Date(tx.date);

      if (tx.status === TransactionStatus.OVERDUE) {
        groups.OVERDUE.push(tx);
      } else if (txDate >= today && txDate < tomorrow) {
        groups.TODAY.push(tx);
      } else if (txDate >= tomorrow && txDate < endOfWeek) {
        groups.THIS_WEEK.push(tx);
      } else if (txDate >= endOfWeek && txDate <= endOfMonth) {
        groups.THIS_MONTH.push(tx);
      } else if (txDate >= startOfNextMonth && txDate <= endOfNextMonth) {
        groups.NEXT_MONTH.push(tx);
      } else if (txDate > endOfNextMonth) {
        groups.FUTURE.push(tx);
      } else if (txDate < today && tx.status === TransactionStatus.COMPLETED) {
        // Transações passadas completadas
        groups.PAST.push(tx);
      }
    }

    // Ordenar PAST do mais recente para o mais antigo
    groups.PAST.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Ordem desejada dos grupos
    const orderedKeys: PeriodKey[] = [
      'OVERDUE',
      'TODAY',
      'THIS_WEEK',
      'THIS_MONTH',
      'NEXT_MONTH',
      'FUTURE',
      'PAST',
    ];

    return orderedKeys
      .filter((period) => groups[period].length > 0)
      .map((period) => ({
        period,
        label: labels[period],
        transactions: groups[period].slice(0, limitPerGroup),
        count: groups[period].length,
        hasMore: groups[period].length > limitPerGroup,
      }));
  }

  private readonly logger = new Logger(TransactionService.name);

  /**
   * Cron job que roda diariamente à meia-noite para atualizar status de transações.
   * Transações PLANNED com data no passado são marcadas como COMPLETED.
   */
  @Cron('0 0 0 * * *') // Every day at midnight
  async updateTransactionStatuses(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.prismaService.transaction.updateMany({
      where: {
        status: TransactionStatus.PLANNED,
        date: { lt: today },
      },
      data: {
        status: TransactionStatus.COMPLETED,
      },
    });

    if (result.count > 0) {
      this.logger.log(
        `Updated ${result.count} transactions from PLANNED to COMPLETED`,
      );
    }
  }
}
