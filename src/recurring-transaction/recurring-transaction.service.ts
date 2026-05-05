import { Injectable } from '@nestjs/common';
import { addMonths, subMonths, differenceInDays } from 'date-fns';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  DayMode,
  Prisma,
  RecurrenceFrequency,
  RecurrenceType,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
} from '@prisma/client';
import { CreateRecurringTransactionInput } from './input/create-recurring-transaction.input';
import { UpdateRecurringTransactionInput } from './input/update-recurring-transaction.input';
import {
  RecurringTransactionModel,
  OrdenationRecurringTransactionArgs,
  RecurringTransactionFilterArgs,
  RecurringTransactionSuggestion,
} from './recurring-transaction.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';
import { CardService } from '@/card/card.service';
import { CardType } from '@/lib/graphql/prisma-client';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';

@Injectable()
export class RecurringTransactionService {
  private readonly MAX_GENERATION_YEARS = 2;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cardService: CardService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  /**
   * Creates a recurring transaction and generates all individual transactions upfront
   */
  async createWithTransactions(
    data: CreateRecurringTransactionInput,
    userId: string,
  ) {
    const dayMode = (data.dayMode as DayMode) || DayMode.SPECIFIC_DAY;
    const frequency = data.frequency as RecurrenceFrequency;

    // Validate based on frequency and dayMode
    if (
      frequency === RecurrenceFrequency.WEEKLY ||
      frequency === RecurrenceFrequency.BI_WEEKLY
    ) {
      // Weekly/Bi-weekly requires dayOfWeek
      if (
        data.dayOfWeek === undefined ||
        data.dayOfWeek < 0 ||
        data.dayOfWeek > 6
      ) {
        throw new Error(
          'Day of week (0-6) is required for weekly/bi-weekly recurrence',
        );
      }
    } else if (
      frequency === RecurrenceFrequency.MONTHLY ||
      frequency === RecurrenceFrequency.YEARLY
    ) {
      // Monthly/Yearly with SPECIFIC_DAY requires dayOfMonth
      if (dayMode === DayMode.SPECIFIC_DAY) {
        if (!data.dayOfMonth || data.dayOfMonth < 1 || data.dayOfMonth > 31) {
          throw new Error(
            'Day of month (1-31) is required for specific day mode',
          );
        }
      }

      // NTH_WEEKDAY requires dayOfWeek and weekOfMonth
      if (dayMode === DayMode.NTH_WEEKDAY) {
        if (
          data.dayOfWeek === undefined ||
          data.dayOfWeek < 0 ||
          data.dayOfWeek > 6
        ) {
          throw new Error('Day of week (0-6) is required for nth weekday mode');
        }
        if (!data.weekOfMonth || data.weekOfMonth < 1 || data.weekOfMonth > 5) {
          throw new Error(
            'Week of month (1-5) is required for nth weekday mode',
          );
        }
      }
    }

    // Validate monthOfYear for yearly frequency
    if (frequency === RecurrenceFrequency.YEARLY && !data.monthOfYear) {
      throw new Error('Month of year is required for yearly recurrence');
    }

    if (data.monthOfYear && (data.monthOfYear < 1 || data.monthOfYear > 12)) {
      throw new Error('Month of year must be between 1 and 12');
    }

    // Validate account based on transaction type
    if (data.type === TransactionType.INCOME && !data.destinyAccountId) {
      throw new Error('Destiny account is required for income transactions');
    }

    if (
      data.type === TransactionType.EXPENSE &&
      !data.sourceAccountId &&
      !data.sourceCardId
    ) {
      throw new Error(
        'Source account or card is required for expense transactions',
      );
    }

    if (
      data.type === TransactionType.BETWEEN_ACCOUNTS &&
      (!data.sourceAccountId || !data.destinyAccountId)
    ) {
      throw new Error(
        'Both source and destiny accounts are required for between accounts transactions',
      );
    }

    // Para INSTALLMENT, limitar ao número de parcelas
    const isInstallment = data.recurrenceType === 'INSTALLMENT';

    let occurrences: Date[];

    if (isInstallment && data.totalInstallments) {
      // Para parcelamento: primeira parcela no startDate, subsequentes no mesmo dia de cada mês
      occurrences = [new Date(data.startDate)];
      const baseYear = data.startDate.getFullYear();
      const baseMonth = data.startDate.getMonth();
      const targetDay = data.dayOfMonth || data.startDate.getDate();

      for (let i = 1; i < data.totalInstallments; i++) {
        // Calcular o mês alvo
        const targetMonth = baseMonth + i;
        const targetYear = baseYear + Math.floor(targetMonth / 12);
        const actualMonth = targetMonth % 12;

        // Criar data com dia 1 primeiro (evita transbordamento)
        const nextDate = new Date(targetYear, actualMonth, 1);

        // Calcular último dia do mês
        const lastDayOfMonth = new Date(
          targetYear,
          actualMonth + 1,
          0,
        ).getDate();

        // Setar o dia correto (ou último dia se não existir)
        nextDate.setDate(Math.min(targetDay, lastDayOfMonth));

        occurrences.push(nextDate);
      }
    } else {
      // Recorrência normal (PERIODIC)
      occurrences = this.calculateOccurrences(
        data.startDate,
        data.endDate,
        frequency,
        dayMode,
        data.dayOfMonth,
        data.dayOfWeek,
        data.weekOfMonth,
        data.monthOfYear,
        data.repeatCount,
      );
    }

    // Preserve the time component from startDate in all occurrences
    // This prevents timezone-related off-by-one-day bugs (e.g. midnight UTC
    // showing as previous day in UTC-3)
    occurrences = this.normalizeOccurrenceTimes(occurrences);

    if (occurrences.length === 0 && data.isActive !== false) {
      throw new Error(
        'No occurrences could be generated for the given parameters',
      );
    }

    // Create the recurring transaction template
    const recurring = await this.prismaService.recurringTransaction.create({
      data: {
        description: data.description,
        estimatedAmount: data.estimatedAmount,
        type: data.type as TransactionType,
        paymentMethod: data.paymentMethod as PaymentMethod | undefined,
        frequency,
        dayMode,
        dayOfMonth: data.dayOfMonth,
        dayOfWeek: data.dayOfWeek,
        weekOfMonth: data.weekOfMonth,
        monthOfYear: data.monthOfYear,
        startDate: data.startDate,
        endDate: data.endDate,
        sourceAccountId: data.sourceAccountId,
        destinyAccountId: data.destinyAccountId,
        sourceCardId: data.sourceCardId,
        recurrenceType:
          (data.recurrenceType as RecurrenceType) || RecurrenceType.PERIODIC,
        totalInstallments: isInstallment ? data.totalInstallments : null,
        repeatCount: data.repeatCount,
        isActive: data.isActive !== false,
        userId,
      },
    });

    // Link existing transactions if provided
    if (data.transactionIdsToLink && data.transactionIdsToLink.length > 0) {
      await this.prismaService.transaction.updateMany({
        where: {
          id: { in: data.transactionIdsToLink },
          userId,
          recurringTransactionId: null,
        },
        data: {
          recurringTransactionId: recurring.id,
        },
      });
    }

    // Determine status based on account type
    const baseStatus = await this.determineStatus(
      data.type as TransactionType,
      data.sourceCardId || undefined,
    );

    // Filter out occurrences that already have a linked transaction
    let occurrencesToGenerate = occurrences;
    if (data.transactionIdsToLink && data.transactionIdsToLink.length > 0) {
      const linkedTransactions = await this.prismaService.transaction.findMany({
        where: { id: { in: data.transactionIdsToLink } },
        select: { date: true },
      });

      if (linkedTransactions.length > 0) {
        const maxLinkedDate = new Date(
          Math.max(...linkedTransactions.map((t) => t.date.getTime())),
        );
        occurrencesToGenerate = occurrences.filter(
          (date) => date.getTime() > maxLinkedDate.getTime(),
        );
      }
    }

    // If not active, don't generate any future transactions
    if (data.isActive === false) {
      occurrencesToGenerate = [];
    }

    // Generate all transactions
    // Para parcelamento, calcular valor de cada parcela
    const installmentAmount =
      isInstallment && data.totalInstallments
        ? Number((data.estimatedAmount / data.totalInstallments).toFixed(2))
        : data.estimatedAmount;

    for (let i = 0; i < occurrencesToGenerate.length; i++) {
      const date = occurrencesToGenerate[i];

      const transaction = await this.prismaService.transaction.create({
        data: {
          description: data.description,
          amount: installmentAmount,
          date,
          status: baseStatus,
          type: data.type as TransactionType,
          paymentMethod: data.paymentMethod as PaymentMethod | undefined,
          sourceAccountId: data.sourceAccountId,
          destinyAccountId: data.destinyAccountId,
          sourceCardId: data.sourceCardId,
          recurringTransactionId: recurring.id,
          userId,
          category: data.category,
        },
      });

      // If it's a credit card expense, link to billing
      if (
        data.type === TransactionType.EXPENSE &&
        data.sourceCardId &&
        baseStatus === TransactionStatus.COMPLETED
      ) {
        await this.linkTransactionToBilling(
          transaction.id,
          data.sourceCardId,
          date,
        );
      }
    }

    return recurring;
  }

  /**
   * Determines the initial status for transactions based on account type
   */
  private async determineStatus(
    type: TransactionType,
    sourceCardId?: string,
  ): Promise<TransactionStatus> {
    if (type === TransactionType.EXPENSE && sourceCardId) {
      const card = await this.prismaService.card.findUnique({
        where: { id: sourceCardId },
      });

      if (card?.type === CardType.CREDIT) {
        return TransactionStatus.COMPLETED;
      }
    }

    return TransactionStatus.PLANNED;
  }

  /**
   * Links a transaction to the appropriate card billing period
   */
  private async linkTransactionToBilling(
    transactionId: string,
    cardId: string,
    date: Date,
  ) {
    const card = await this.prismaService.card.findUnique({
      where: { id: cardId },
    });

    if (!card) return;

    // Find the billing for this date
    const billing = await this.prismaService.cardBilling.findFirst({
      where: {
        cardId: card.id,
        periodStart: { lte: date },
        OR: [{ periodEnd: { gte: date } }, { periodEnd: null }],
      },
    });

    // If no billing exists, we'll create one with the proper periodStart
    if (!billing) {
      const newBilling = await this.cardService.createBilling({
        cardId: card.id,
        cardBillingCycleDay: card.billingCycleDay,
        cardBillingPaymentDay: card.billingPaymentDay,
        periodStart: date,
        limit: card.defaultLimit,
      });

      await this.prismaService.transaction.update({
        where: { id: transactionId },
        data: { cardBillingId: newBilling.id },
      });

      await this.cardService.updatePaymentTransaction(newBilling.id);
    } else {
      await this.prismaService.transaction.update({
        where: { id: transactionId },
        data: { cardBillingId: billing.id },
      });

      await this.cardService.updatePaymentTransaction(billing.id);
    }
  }

  /**
   * Calculates all occurrence dates for a recurring transaction
   */
  private calculateOccurrences(
    startDate: Date,
    endDate: Date | null | undefined,
    frequency: RecurrenceFrequency,
    dayMode: DayMode,
    dayOfMonth?: number | null,
    dayOfWeek?: number | null,
    weekOfMonth?: number | null,
    monthOfYear?: number | null,
    repeatCount?: number | null,
  ): Date[] {
    const dates: Date[] = [];
    const maxDate =
      endDate || this.addYears(new Date(), this.MAX_GENERATION_YEARS);

    // Handle weekly/bi-weekly frequency
    if (
      frequency === RecurrenceFrequency.WEEKLY ||
      frequency === RecurrenceFrequency.BI_WEEKLY
    ) {
      const weekInterval = frequency === RecurrenceFrequency.BI_WEEKLY ? 2 : 1;
      let currentDate = this.getNextWeekday(startDate, dayOfWeek ?? 0);

      // If starting weekday is same as startDate, use startDate
      if (startDate.getDay() === dayOfWeek) {
        currentDate = new Date(startDate);
      }

      while (currentDate <= maxDate) {
        if (repeatCount && dates.length >= repeatCount) break;
        dates.push(new Date(currentDate));
        currentDate = this.addWeeks(currentDate, weekInterval);
      }
      return dates;
    }

    // Handle monthly frequency
    if (frequency === RecurrenceFrequency.MONTHLY) {
      let year = startDate.getFullYear();
      let month = startDate.getMonth();

      while (true) {
        const occurrenceDate = this.getDateForDayMode(
          year,
          month,
          dayMode,
          dayOfMonth,
          dayOfWeek,
          weekOfMonth,
        );

        if (
          occurrenceDate &&
          occurrenceDate >= startDate &&
          occurrenceDate <= maxDate
        ) {
          if (repeatCount && dates.length >= repeatCount) break;
          dates.push(occurrenceDate);
        }

        // Move to next month
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }

        // Check if we've passed the max date
        const checkDate = new Date(year, month, 1);
        if (checkDate > maxDate) break;
      }
      return dates;
    }

    // Handle yearly frequency
    if (frequency === RecurrenceFrequency.YEARLY) {
      let year = startDate.getFullYear();
      const targetMonth = (monthOfYear ?? 1) - 1; // Convert 1-12 to 0-11

      while (true) {
        const occurrenceDate = this.getDateForDayMode(
          year,
          targetMonth,
          dayMode,
          dayOfMonth,
          dayOfWeek,
          weekOfMonth,
        );

        if (
          occurrenceDate &&
          occurrenceDate >= startDate &&
          occurrenceDate <= maxDate
        ) {
          if (repeatCount && dates.length >= repeatCount) break;
          dates.push(occurrenceDate);
        }

        year++;
        if (new Date(year, targetMonth, 1) > maxDate) break;
      }
      return dates;
    }

    return dates;
  }

  /**
   * Gets the correct date for a given month/year based on the DayMode
   */
  private getDateForDayMode(
    year: number,
    month: number,
    dayMode: DayMode,
    dayOfMonth?: number | null,
    dayOfWeek?: number | null,
    weekOfMonth?: number | null,
  ): Date | null {
    switch (dayMode) {
      case DayMode.SPECIFIC_DAY: {
        const lastDay = new Date(year, month + 1, 0).getDate();
        return new Date(year, month, Math.min(dayOfMonth ?? 1, lastDay));
      }

      case DayMode.LAST_DAY:
        return this.getLastDayOfMonth(year, month);

      case DayMode.LAST_BUSINESS_DAY:
        return this.getLastBusinessDayOfMonth(year, month);

      case DayMode.FIRST_BUSINESS_DAY:
        return this.getFirstBusinessDayOfMonth(year, month);

      case DayMode.NTH_WEEKDAY:
        return this.getNthWeekdayOfMonth(
          year,
          month,
          dayOfWeek ?? 0,
          weekOfMonth ?? 1,
        );

      default:
        return new Date(year, month, dayOfMonth ?? 1);
    }
  }

  /**
   * Updates a recurring transaction and optionally future transactions
   */
  async updateFromDate(
    recurringId: string,
    fromDate: Date,
    updates: UpdateRecurringTransactionInput,
    userId: string,
  ) {
    // Verify ownership
    const recurring = await this.prismaService.recurringTransaction.findFirst({
      where: { id: recurringId, userId },
    });

    if (!recurring) {
      throw new Error('Recurring transaction not found');
    }

    // Update future transactions
    const transactionUpdates: Prisma.TransactionUncheckedUpdateManyInput = {};

    if (updates.description) {
      transactionUpdates.description = updates.description;
    }
    if (updates.estimatedAmount) {
      transactionUpdates.amount = updates.estimatedAmount;
    }
    if (updates.paymentMethod) {
      transactionUpdates.paymentMethod = updates.paymentMethod as PaymentMethod;
    }
    if (updates.sourceAccountId !== undefined) {
      transactionUpdates.sourceAccountId = updates.sourceAccountId;
    }
    if (updates.destinyAccountId !== undefined) {
      transactionUpdates.destinyAccountId = updates.destinyAccountId;
    }
    if (updates.sourceCardId !== undefined) {
      transactionUpdates.sourceCardId = updates.sourceCardId;
    }

    if (Object.keys(transactionUpdates).length > 0) {
      await this.prismaService.transaction.updateMany({
        where: {
          recurringTransactionId: recurringId,
          date: { gte: fromDate },
        },
        data: transactionUpdates,
      });
    }

    // Handle endDate changes - may need to add or remove transactions
    if (updates.endDate !== undefined) {
      await this.handleEndDateChange(recurring, updates.endDate, userId);
    }

    // Update the template
    const recurringUpdates: Prisma.RecurringTransactionUncheckedUpdateInput =
      {};
    if (updates.description) recurringUpdates.description = updates.description;
    if (updates.estimatedAmount)
      recurringUpdates.estimatedAmount = updates.estimatedAmount;
    if (updates.paymentMethod)
      recurringUpdates.paymentMethod = updates.paymentMethod as PaymentMethod;
    if (updates.dayOfMonth) recurringUpdates.dayOfMonth = updates.dayOfMonth;
    if (updates.monthOfYear !== undefined)
      recurringUpdates.monthOfYear = updates.monthOfYear;
    if (updates.endDate !== undefined)
      recurringUpdates.endDate = updates.endDate;
    if (updates.isActive !== undefined)
      recurringUpdates.isActive = updates.isActive;
    if (updates.sourceAccountId !== undefined)
      recurringUpdates.sourceAccountId = updates.sourceAccountId;
    if (updates.destinyAccountId !== undefined)
      recurringUpdates.destinyAccountId = updates.destinyAccountId;
    if (updates.sourceCardId !== undefined)
      recurringUpdates.sourceCardId = updates.sourceCardId;

    return this.prismaService.recurringTransaction.update({
      where: { id: recurringId },
      data: recurringUpdates,
    });
  }

  /**
   * Handles changes to the end date of a recurring transaction
   */
  private async handleEndDateChange(
    recurring: {
      id: string;
      endDate: Date | null;
      startDate: Date;
      frequency: RecurrenceFrequency;
      dayMode: DayMode;
      dayOfMonth: number | null;
      dayOfWeek: number | null;
      weekOfMonth: number | null;
      monthOfYear: number | null;
      description: string;
      estimatedAmount: Prisma.Decimal;
      type: TransactionType;
      paymentMethod: PaymentMethod | null;
      sourceAccountId: string | null;
      destinyAccountId: string | null;
      sourceCardId: string | null;
      userId: string;
    },
    newEndDate: Date | null,
    userId: string,
  ) {
    const oldEndDate =
      recurring.endDate || this.addYears(new Date(), this.MAX_GENERATION_YEARS);

    if (newEndDate === null) {
      // Extending to no end date - add transactions up to MAX_GENERATION_YEARS from now
      const newMaxDate = this.addYears(new Date(), this.MAX_GENERATION_YEARS);
      const lastTransaction = await this.prismaService.transaction.findFirst({
        where: { recurringTransactionId: recurring.id },
        orderBy: { date: 'desc' },
      });

      if (lastTransaction && lastTransaction.date < newMaxDate) {
        // Generate new transactions from last date to new max
        let newOccurrences = this.calculateOccurrences(
          this.addMonths(
            lastTransaction.date,
            recurring.frequency === RecurrenceFrequency.MONTHLY ? 1 : 0,
          ),
          newMaxDate,
          recurring.frequency,
          recurring.dayMode,
          recurring.dayOfMonth,
          recurring.dayOfWeek,
          recurring.weekOfMonth,
          recurring.monthOfYear,
        ).filter((d) => d > lastTransaction.date);

        newOccurrences = this.normalizeOccurrenceTimes(newOccurrences);

        const baseStatus = await this.determineStatus(
          recurring.type,
          recurring.sourceCardId || undefined,
        );

        for (const date of newOccurrences) {
          await this.prismaService.transaction.create({
            data: {
              description: recurring.description,
              amount: recurring.estimatedAmount,
              date,
              status: baseStatus,
              type: recurring.type,
              paymentMethod: recurring.paymentMethod,
              sourceAccountId: recurring.sourceAccountId,
              destinyAccountId: recurring.destinyAccountId,
              sourceCardId: recurring.sourceCardId,
              recurringTransactionId: recurring.id,
              userId,
            },
          });
        }
      }
    } else if (newEndDate < oldEndDate) {
      // Shrinking - delete transactions after new end date
      await this.prismaService.transaction.deleteMany({
        where: {
          recurringTransactionId: recurring.id,
          date: { gt: newEndDate },
        },
      });
    } else if (newEndDate > oldEndDate) {
      // Extending - add transactions from old end date to new end date
      let newOccurrences = this.calculateOccurrences(
        oldEndDate,
        newEndDate,
        recurring.frequency,
        recurring.dayMode,
        recurring.dayOfMonth,
        recurring.dayOfWeek,
        recurring.weekOfMonth,
        recurring.monthOfYear,
      ).filter((d) => d > oldEndDate);

      newOccurrences = this.normalizeOccurrenceTimes(newOccurrences);

      const baseStatus = await this.determineStatus(
        recurring.type,
        recurring.sourceCardId || undefined,
      );

      for (const date of newOccurrences) {
        await this.prismaService.transaction.create({
          data: {
            description: recurring.description,
            amount: recurring.estimatedAmount,
            date,
            status: baseStatus,
            type: recurring.type,
            paymentMethod: recurring.paymentMethod,
            sourceAccountId: recurring.sourceAccountId,
            destinyAccountId: recurring.destinyAccountId,
            sourceCardId: recurring.sourceCardId,
            recurringTransactionId: recurring.id,
            userId,
          },
        });
      }
    }
  }

  /**
   * Pauses a recurring transaction (keeps existing transactions)
   */
  async pause(recurringId: string, userId: string) {
    return this.prismaService.recurringTransaction.update({
      where: { id: recurringId, userId },
      data: { isActive: false },
    });
  }

  /**
   * Resumes a paused recurring transaction
   */
  async resume(recurringId: string, userId: string) {
    return this.prismaService.recurringTransaction.update({
      where: { id: recurringId, userId },
      data: { isActive: true },
    });
  }

  /**
   * Ends a recurring transaction at a specific date, removing future transactions
   */
  async endRecurrence(recurringId: string, endDate: Date, userId: string) {
    // Delete transactions after end date
    await this.prismaService.transaction.deleteMany({
      where: {
        recurringTransactionId: recurringId,
        date: { gt: endDate },
      },
    });

    return this.prismaService.recurringTransaction.update({
      where: { id: recurringId, userId },
      data: { endDate, isActive: false },
    });
  }

  /**
   * Deletes a recurring transaction
   */
  async delete(
    recurringId: string,
    userId: string,
    deleteAllTransactions = false,
  ) {
    if (deleteAllTransactions) {
      // Delete all linked transactions
      await this.prismaService.transaction.deleteMany({
        where: { recurringTransactionId: recurringId },
      });
    } else {
      // Unlink all transactions
      await this.prismaService.transaction.updateMany({
        where: { recurringTransactionId: recurringId },
        data: { recurringTransactionId: null },
      });
    }

    return this.prismaService.recurringTransaction.delete({
      where: { id: recurringId, userId },
    });
  }

  async findTransactionsByRecurrence(recurringId: string, userId: string) {
    return this.prismaService.transaction.findMany({
      where: {
        recurringTransactionId: recurringId,
        userId,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    return this.prismaService.recurringTransaction.findFirst({
      where: { id, userId },
    });
  }

  async findMany({
    filterArgs,
    userId,
    queriedFields,
    paginationArgs,
    searchArgs,
    ordenationArgs,
  }: {
    filterArgs: RecurringTransactionFilterArgs;
    userId: string;
    queriedFields: (keyof RecurringTransactionModel)[];
    paginationArgs: PaginationArgs;
    searchArgs: SearchArgs;
    ordenationArgs: OrdenationRecurringTransactionArgs;
  }) {
    const { after, before, first, last } = paginationArgs;
    const { orderBy, orderDirection = OrderDirection.Asc } = ordenationArgs;

    const unbufferedCursor = after
      ? Number(Buffer.from(after, 'base64').toString('utf-8'))
      : before
        ? Number(Buffer.from(before, 'base64').toString('utf-8'))
        : 0;

    const whereClause: Prisma.RecurringTransactionWhereInput = {
      userId,
      ...(filterArgs.isActive !== undefined && {
        isActive: filterArgs.isActive,
      }),
      ...(filterArgs.accountId && {
        OR: [
          { sourceAccountId: filterArgs.accountId },
          { destinyAccountId: filterArgs.accountId },
        ],
      }),
      ...(searchArgs.search && {
        description: {
          contains: searchArgs.search,
          mode: 'insensitive',
        },
      }),
    };

    const totalCount = await this.prismaService.recurringTransaction.count({
      where: whereClause,
    });

    const items = await this.prismaService.recurringTransaction.findMany({
      take: last ? last : first || undefined,
      skip: unbufferedCursor,
      orderBy: orderBy ? { [orderBy]: orderDirection } : undefined,
      select: selectObject(queriedFields),
      where: whereClause,
    });

    if (items.length === 0) {
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

    const edges = items.map((item, index) => {
      const cursorIndex = index + 1 + unbufferedCursor;
      const bufferedCursor = Buffer.from(cursorIndex.toString())
        .toString('base64')
        .split('=')[0];

      return {
        cursor: bufferedCursor,
        node: item,
      };
    });

    const startCursor = edges[0].cursor;
    const endCursor = edges[edges.length - 1].cursor;

    const hasNextPage = unbufferedCursor + items.length < totalCount;
    const hasPreviousPage = unbufferedCursor > 0;

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

  // Helper functions
  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  private addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  private addWeeks(date: Date, weeks: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  private isBusinessDay(date: Date): boolean {
    return !this.isWeekend(date);
  }

  private getLastDayOfMonth(year: number, month: number): Date {
    // month is 0-indexed, so new Date(year, month + 1, 0) gives last day of month
    return new Date(year, month + 1, 0);
  }

  private getLastBusinessDayOfMonth(year: number, month: number): Date {
    const lastDay = this.getLastDayOfMonth(year, month);
    while (this.isWeekend(lastDay)) {
      lastDay.setDate(lastDay.getDate() - 1);
    }
    return lastDay;
  }

  private getFirstBusinessDayOfMonth(year: number, month: number): Date {
    const firstDay = new Date(year, month, 1);
    while (this.isWeekend(firstDay)) {
      firstDay.setDate(firstDay.getDate() + 1);
    }
    return firstDay;
  }

  private getLastDayOfYear(year: number): Date {
    return new Date(year, 11, 31); // December 31
  }

  private getLastBusinessDayOfYear(year: number): Date {
    const lastDay = this.getLastDayOfYear(year);
    while (this.isWeekend(lastDay)) {
      lastDay.setDate(lastDay.getDate() - 1);
    }
    return lastDay;
  }

  private getFirstBusinessDayOfYear(year: number): Date {
    const firstDay = new Date(year, 0, 1); // January 1
    while (this.isWeekend(firstDay)) {
      firstDay.setDate(firstDay.getDate() + 1);
    }
    return firstDay;
  }

  /**
   * Gets the Nth occurrence of a specific weekday in a month
   * @param year - Year
   * @param month - Month (0-indexed)
   * @param dayOfWeek - Day of week (0=Sunday, 6=Saturday)
   * @param nth - Which occurrence (1=first, 2=second, etc.)
   */
  private getNthWeekdayOfMonth(
    year: number,
    month: number,
    dayOfWeek: number,
    nth: number,
  ): Date | null {
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Calculate the first occurrence of the desired day
    let daysToAdd = dayOfWeek - firstDayOfWeek;
    if (daysToAdd < 0) daysToAdd += 7;

    const firstOccurrence = new Date(year, month, 1 + daysToAdd);

    // Add weeks for nth occurrence
    const result = new Date(firstOccurrence);
    result.setDate(result.getDate() + (nth - 1) * 7);

    // Verify it's still in the same month
    if (result.getMonth() !== month) {
      return null; // nth occurrence doesn't exist in this month
    }

    return result;
  }

  /**
   * Gets date for a specific day of week in a given week
   */
  private getNextWeekday(startDate: Date, dayOfWeek: number): Date {
    const result = new Date(startDate);
    const currentDay = result.getDay();
    let daysToAdd = dayOfWeek - currentDay;
    if (daysToAdd <= 0) daysToAdd += 7;
    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  /**
   * Sets the time component of each occurrence date to 3am UTC (03:00).
   * This prevents timezone-related off-by-one-day bugs: dates constructed
   * via `new Date(year, month, day)` default to midnight in the server's
   * local timezone (UTC in Docker). A user in UTC-3 would see midnight UTC
   * as 21:00 of the *previous day*.
   */
  private normalizeOccurrenceTimes(dates: Date[]): Date[] {
    return dates.map((d) => {
      const normalized = new Date(d);
      normalized.setUTCHours(3, 0, 0, 0);
      return normalized;
    });
  }

  async findSuggestions(
    userId: string,
  ): Promise<RecurringTransactionSuggestion[]> {
    const now = new Date();
    const startDate = subMonths(now, 6);
    const endDate = addMonths(now, 6);

    // Get ignored suggestions from Redis
    const ignoredKey =
      `recurring-transaction-ignored-suggestions:${userId}` as const;
    const ignoredList = (await this.redisCacheService.get(ignoredKey)) || [];

    // Fetch all unlinked transactions in the period
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
        recurringTransactionId: null,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    // Group by normalized description
    const groups: Record<string, typeof transactions> = {};
    for (const t of transactions) {
      const normalized = t.description.trim().toLowerCase();
      if (!groups[normalized]) groups[normalized] = [];
      groups[normalized].push(t);
    }

    const suggestions: RecurringTransactionSuggestion[] = [];

    for (const [desc, group] of Object.entries(groups)) {
      // Filter out ignored ones
      if (ignoredList.includes(desc)) continue;

      // Minimum 2 occurrences
      if (group.length < 2) continue;

      // Check for periodicity
      const intervals: number[] = [];
      for (let i = 1; i < group.length; i++) {
        intervals.push(differenceInDays(group[i].date, group[i - 1].date));
      }

      // Find common interval (mode-ish)
      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;

      let frequency: RecurrenceFrequency | null = null;
      if (avgInterval >= 6 && avgInterval <= 8)
        frequency = RecurrenceFrequency.WEEKLY;
      else if (avgInterval >= 13 && avgInterval <= 15)
        frequency = RecurrenceFrequency.BI_WEEKLY;
      else if (avgInterval >= 27 && avgInterval <= 33)
        frequency = RecurrenceFrequency.MONTHLY;
      else if (avgInterval >= 360 && avgInterval <= 370)
        frequency = RecurrenceFrequency.YEARLY;

      if (frequency) {
        const totalAmount = group.reduce((sum, t) => sum + Number(t.amount), 0);
        const avgAmount = Number((totalAmount / group.length).toFixed(2));

        // Find most frequent source/destiny accounts
        const sourceAccounts = group
          .map((t) => t.sourceAccountId)
          .filter(Boolean);
        const destinyAccounts = group
          .map((t) => t.destinyAccountId)
          .filter(Boolean);

        const mostFrequent = (arr: (string | null)[]) => {
          if (arr.length === 0) return undefined;
          const counts = arr.reduce(
            (acc, val) => {
              if (val) acc[val] = (acc[val] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );

          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
          return sorted.length > 0 ? sorted[0][0] : undefined;
        };

        suggestions.push({
          description: group[0].description, // Keep the original casing from the first one
          averageAmount: avgAmount,
          frequency: frequency as any,
          suggestedDay: group[group.length - 1].date.getDate(),
          sourceAccountId: mostFrequent(sourceAccounts),
          destinyAccountId: mostFrequent(destinyAccounts),
          transactionIds: group.map((t) => t.id),
          transactions: group as any,
          occurrenceCount: group.length,
        });
      }
    }

    return suggestions;
  }

  async ignoreSuggestion(userId: string, description: string) {
    const ignoredKey =
      `recurring-transaction-ignored-suggestions:${userId}` as const;
    const normalized = description.trim().toLowerCase();
    const current = (await this.redisCacheService.get(ignoredKey)) || [];
    if (!current.includes(normalized)) {
      await this.redisCacheService.set(ignoredKey, [...current, normalized]);
    }
  }
}
