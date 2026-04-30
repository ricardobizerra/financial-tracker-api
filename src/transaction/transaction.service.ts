import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  CardType,
  Transaction,
  TransactionCreateInput,
} from '@/lib/graphql/prisma-client';
import {
  Prisma,
  TransactionType,
  TransactionStatus,
  CardBillingStatus,
} from '@prisma/client';
import {
  TransactionModel,
  OrdenationTransactionArgs,
  TransactionFilterArgs,
  CancelCheckInfo,
  TransactionConnection,
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
      ...(filterArgs.cardId && {
        sourceCardId: filterArgs.cardId,
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
      status:
        filterArgs.statuses && filterArgs.statuses.length > 0
          ? { in: filterArgs.statuses }
          : { not: TransactionStatus.CANCELED },
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
  }): Promise<TransactionConnection> {
    const { after, before, first, last } = paginationArgs;
    const { orderBy = 'date', orderDirection = OrderDirection.Desc } =
      ordenationArgs;

    // Build the where clause
    const whereClause = this.buildWhereClause({
      userId,
      filterArgs: {
        ...filterArgs,
        // When paginating with cursors, we ignore hard date boundaries to allow
        // crossing into the past/future
        ...(after || before
          ? { startDate: undefined, endDate: undefined }
          : {}),
      },
      searchArgs,
    });

    // Determine pagination parameters for Prisma
    const take = first ? first : last ? -last : undefined;
    const cursor = after ? { id: after } : before ? { id: before } : undefined;
    const skip = cursor ? 1 : 0;

    // Determinar quais campos "computados" foram solicitados
    const cancelFields = ['canCancel', 'cancelReason', 'cancelWarningMessage'];
    const installmentFields = [
      'installments',
      'installmentStartDate',
      'totalInstallments',
      'installmentNumber',
      'installmentId',
    ];
    const needsCancelInfo = queriedFields.some((f) =>
      cancelFields.includes(f as string),
    );
    const needsInstallments = queriedFields.some((f) =>
      installmentFields.includes(f as string),
    );

    const baseSelect = selectObject<Transaction, TransactionModel>(
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
    );

    const transactions = await this.prismaService.transaction.findMany({
      take,
      skip,
      cursor,
      orderBy: [
        { [orderBy]: orderDirection === OrderDirection.Asc ? 'asc' : 'desc' },
        { id: orderDirection === OrderDirection.Asc ? 'asc' : 'desc' },
      ],
      select: {
        ...baseSelect,
        id: true,
        status: true,
        date: true,
        cardBilling: needsCancelInfo
          ? baseSelect.cardBilling &&
            typeof baseSelect.cardBilling === 'object' &&
            'select' in baseSelect.cardBilling
            ? {
                select: {
                  ...(baseSelect.cardBilling as any).select,
                  status: true,
                },
              }
            : { select: { status: true } }
          : baseSelect.cardBilling,
        installments:
          needsInstallments || needsCancelInfo
            ? {
                include: {
                  cardBilling: { select: { status: true, periodStart: true } },
                },
                orderBy: { installmentNumber: 'asc' as const },
              }
            : (baseSelect.installments as any),
      },
      where: whereClause,
    });

    if (transactions.length === 0) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    // Process transactions and attach computed data
    const processedTransactions = transactions.map((transaction) => {
      let installmentStartDate: TransactionModel['installmentStartDate'];
      let canCancel: TransactionModel['canCancel'];
      let cancelReason: TransactionModel['cancelReason'];
      let cancelWarningMessage: TransactionModel['cancelWarningMessage'];

      if (needsInstallments) {
        const firstInstallment = transaction.installments?.find(
          (i) => i.installmentNumber === 1,
        );
        installmentStartDate =
          (firstInstallment as any)?.cardBilling?.periodStart ??
          transaction.date;
      }

      if (needsCancelInfo) {
        const cancelInfo = this.computeCancelInfo(
          transaction,
          transaction.installments,
        );
        canCancel = cancelInfo.canCancel;
        cancelReason = cancelInfo.reason;
        cancelWarningMessage = cancelInfo.warningMessage;
      }

      return {
        ...transaction,
        installmentStartDate,
        canCancel,
        cancelReason,
        cancelWarningMessage,
      };
    });

    const edges = processedTransactions.map((transaction) => ({
      cursor: transaction.id,
      node: transaction,
    }));

    const startCursor = edges[0].cursor;
    const endCursor = edges[edges.length - 1].cursor;

    // Detect if there's more data in either direction, ignoring date limits
    // to allow infinite scroll to cross the initial window.
    const whereWithoutDates = { ...whereClause, date: undefined };

    const hasNextPage = await this.prismaService.transaction
      .findFirst({
        take: 1,
        skip: 1,
        cursor: { id: endCursor },
        orderBy: [
          { [orderBy]: orderDirection === OrderDirection.Asc ? 'asc' : 'desc' },
          { id: orderDirection === OrderDirection.Asc ? 'asc' : 'desc' },
        ],
        where: whereWithoutDates,
        select: { id: true },
      })
      .then((item) => !!item);

    const hasPreviousPage = await this.prismaService.transaction
      .findFirst({
        take: -1,
        skip: 1,
        cursor: { id: startCursor },
        orderBy: [
          { [orderBy]: orderDirection === OrderDirection.Asc ? 'asc' : 'desc' },
          { id: orderDirection === OrderDirection.Asc ? 'asc' : 'desc' },
        ],
        where: whereWithoutDates,
        select: { id: true },
      })
      .then((item) => !!item);

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
    accountBalance,
    investmentEvents,
  }: {
    userId: string;
    accountId?: string;
    startDate: Date;
    endDate: Date;
    accountBalance: { initialBalance: number; startDate: Date | null };
    investmentEvents?: {
      date: Date;
      amount: number;
      type: 'FUNDING' | 'REDEMPTION';
    }[];
  }) {
    const today = new Date();
    today.setHours(3, 0, 0, 0);

    const chartStart = new Date(startDate);
    chartStart.setHours(3, 0, 0, 0);

    let seedBalance = 0;
    const inWindowByDate = new Map<string, number>();

    if (!accountBalance.startDate) {
      // sem data → considera já ativo
      seedBalance = accountBalance.initialBalance;
    } else {
      const d = new Date(accountBalance.startDate);
      d.setHours(3, 0, 0, 0);

      if (d < chartStart) {
        // startDate antes da janela → saldo inicial já está ativo
        seedBalance = accountBalance.initialBalance;
      } else {
        // startDate dentro/após a janela → saldo inicial entra em um dia específico do gráfico
        const key = d.toISOString().split('T')[0];
        inWindowByDate.set(key, accountBalance.initialBalance);
      }
    }

    // Indexar investment events por data
    const investmentEventsByDate = new Map<
      string,
      { amount: number; type: 'FUNDING' | 'REDEMPTION' }[]
    >();
    if (investmentEvents) {
      for (const event of investmentEvents) {
        const key = event.date.toISOString().split('T')[0];
        const existing = investmentEventsByDate.get(key) || [];
        existing.push({ amount: event.amount, type: event.type });
        investmentEventsByDate.set(key, existing);
      }
    }

    // Pre-compute investment balance impact before chart window starts
    let preWindowInvestmentBalance = 0;
    if (investmentEvents) {
      for (const event of investmentEvents) {
        const eventDate = new Date(event.date);
        eventDate.setHours(3, 0, 0, 0);
        if (eventDate < chartStart) {
          if (event.type === 'FUNDING') {
            preWindowInvestmentBalance -= event.amount;
          } else if (event.type === 'REDEMPTION') {
            preWindowInvestmentBalance += event.amount;
          }
        }
      }
    }

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
        cardBillingId: true,
        sourceCard: {
          select: { id: true, type: true },
        },
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
      isInitialBalance?: boolean;
      transactions: {
        id: string;
        description: string;
        amount: number;
        type: string;
        isIncome: boolean;
      }[];
    }[] = [];

    let runningBalance = seedBalance + preWindowInvestmentBalance;
    const currentDate = new Date(startDate);
    currentDate.setHours(3, 0, 0, 0);
    let currentBalance = seedBalance + preWindowInvestmentBalance;
    let projectedBalance = seedBalance + preWindowInvestmentBalance;
    // Controla se o primeiro evento real já ocorreu; dias vazios anteriores são omitidos
    let chartStarted = false;

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayTransactions = transactionsByDate.get(dateKey) || [];
      const dayInvestmentEvents = investmentEventsByDate.get(dateKey) || [];
      const isProjected = currentDate >= today;

      // Verificar se alguma conta tem startDate neste exato dia
      const inWindowAmount = inWindowByDate.get(dateKey);
      if (inWindowAmount) {
        // Emitir um ponto de âncora do saldo inicial antes das transações do dia
        chartStarted = true;
        dataPoints.push({
          date: new Date(`${dateKey}T03:00:00.000Z`),
          balance: runningBalance + inWindowAmount,
          isProjected,
          incomeAmount: 0,
          expenseAmount: 0,
          transactionCount: 0,
          isInitialBalance: true,
          transactions: [],
        });
        runningBalance += inWindowAmount;
      }

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
        // Pular transações que fazem parte de faturas de cartão de crédito
        if (tx.cardBillingId) return;

        // Pular despesas de cartão de crédito não associadas a uma fatura
        if (
          tx.type === TransactionType.EXPENSE &&
          tx.sourceCard &&
          tx.sourceCard.type === CardType.CREDIT
        ) {
          return;
        }

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

      // Apply investment events for this day
      for (const invEvent of dayInvestmentEvents) {
        if (invEvent.type === 'FUNDING') {
          runningBalance -= invEvent.amount;
          expenseAmount += invEvent.amount;
          dayTxList.push({
            id: `inv-funding-${dateKey}`,
            description: 'Investimento (aporte)',
            amount: invEvent.amount,
            type: 'INVESTMENT_FUNDING',
            isIncome: false,
          });
        } else if (invEvent.type === 'REDEMPTION') {
          runningBalance += invEvent.amount;
          incomeAmount += invEvent.amount;
          dayTxList.push({
            id: `inv-redemption-${dateKey}`,
            description: 'Investimento (resgate)',
            amount: invEvent.amount,
            type: 'INVESTMENT_REDEMPTION',
            isIncome: true,
          });
        }
      }

      // Emitir ponto do dia se houve transações, ou se o gráfico já começou (mantém linha plana)
      // Dias antes do primeiro evento real são omitidos
      if (dayTxList.length > 0) {
        chartStarted = true;
      }
      if (chartStarted) {
        dataPoints.push({
          date: new Date(`${dateKey}T03:00:00.000Z`),
          balance: runningBalance,
          isProjected,
          incomeAmount,
          expenseAmount,
          transactionCount: dayTxList.length,
          transactions: dayTxList,
        });
      }

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
        billingPayment: {
          include: {
            card: {
              include: {
                institutionLink: { include: { institution: true } },
              },
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
   * Transações PLANNED com data no passado são marcadas como OVERDUE.
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
        status: TransactionStatus.OVERDUE,
      },
    });

    if (result.count > 0) {
      this.logger.log(
        `Updated ${result.count} transactions from PLANNED to OVERDUE`,
      );
    }
  }
}
