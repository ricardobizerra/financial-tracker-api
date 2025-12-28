import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  Prisma,
  RecurrenceFrequency,
  RecurrenceType,
  TransactionType,
  AccountType,
  TransactionStatus,
  PaymentMethod,
} from '@prisma/client';
import { CreateRecurringTransactionInput } from './input/create-recurring-transaction.input';
import { UpdateRecurringTransactionInput } from './input/update-recurring-transaction.input';
import {
  RecurringTransactionModel,
  OrdenationRecurringTransactionArgs,
  RecurringTransactionFilterArgs,
} from './recurring-transaction.model';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrderDirection } from '@/utils/args/ordenation.args';
import { selectObject } from '@/utils/select-object';
import { CardService } from '@/card/card.service';

@Injectable()
export class RecurringTransactionService {
  private readonly MAX_GENERATION_YEARS = 2;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cardService: CardService,
  ) {}

  /**
   * Creates a recurring transaction and generates all individual transactions upfront
   */
  async createWithTransactions(
    data: CreateRecurringTransactionInput,
    userId: string,
  ) {
    // Validate dayOfMonth range
    if (data.dayOfMonth < 1 || data.dayOfMonth > 28) {
      throw new Error('Day of month must be between 1 and 28');
    }

    // Validate monthOfYear for yearly frequency
    if (data.frequency === RecurrenceFrequency.YEARLY && !data.monthOfYear) {
      throw new Error('Month of year is required for yearly recurrence');
    }

    if (data.monthOfYear && (data.monthOfYear < 1 || data.monthOfYear > 12)) {
      throw new Error('Month of year must be between 1 and 12');
    }

    // Validate account based on transaction type
    if (data.type === TransactionType.INCOME && !data.destinyAccountId) {
      throw new Error('Destiny account is required for income transactions');
    }

    if (data.type === TransactionType.EXPENSE && !data.sourceAccountId) {
      throw new Error('Source account is required for expense transactions');
    }

    if (
      data.type === TransactionType.BETWEEN_ACCOUNTS &&
      (!data.sourceAccountId || !data.destinyAccountId)
    ) {
      throw new Error(
        'Both source and destiny accounts are required for between accounts transactions',
      );
    }

    // Validate that income transactions are not assigned to credit card accounts
    if (data.type === TransactionType.INCOME && data.destinyAccountId) {
      const destinyAccount = await this.prismaService.account.findUnique({
        where: { id: data.destinyAccountId },
      });

      if (destinyAccount?.type === AccountType.CREDIT_CARD) {
        throw new Error(
          'Income transactions cannot be assigned to credit card accounts',
        );
      }
    }

    // Calculate all occurrence dates
    let occurrences = this.calculateOccurrences(
      data.startDate,
      data.endDate,
      data.frequency as RecurrenceFrequency,
      data.dayOfMonth,
      data.monthOfYear,
    );

    // Para INSTALLMENT, limitar ao número de parcelas
    const isInstallment = data.recurrenceType === 'INSTALLMENT';
    if (isInstallment && data.totalInstallments) {
      occurrences = occurrences.slice(0, data.totalInstallments);
    }

    if (occurrences.length === 0) {
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
        frequency: data.frequency as RecurrenceFrequency,
        dayOfMonth: data.dayOfMonth,
        monthOfYear: data.monthOfYear,
        startDate: data.startDate,
        endDate: data.endDate,
        sourceAccountId: data.sourceAccountId,
        destinyAccountId: data.destinyAccountId,
        recurrenceType:
          (data.recurrenceType as RecurrenceType) || RecurrenceType.PERIODIC,
        totalInstallments: isInstallment ? data.totalInstallments : null,
        userId,
      },
    });

    // Determine status based on account type
    const baseStatus = await this.determineStatus(
      data.type as TransactionType,
      data.sourceAccountId,
    );

    // Generate all transactions
    // Para parcelamento, calcular valor de cada parcela
    const installmentAmount =
      isInstallment && data.totalInstallments
        ? Number((data.estimatedAmount / data.totalInstallments).toFixed(2))
        : data.estimatedAmount;

    for (let i = 0; i < occurrences.length; i++) {
      const date = occurrences[i];
      const installmentNumber = isInstallment ? i + 1 : null;
      const totalInstallments = isInstallment ? occurrences.length : null;

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
          recurringTransactionId: recurring.id,
          installmentNumber,
          totalInstallments,
          userId,
        },
      });

      // If it's a credit card expense, link to billing
      if (
        data.type === TransactionType.EXPENSE &&
        data.sourceAccountId &&
        baseStatus === TransactionStatus.COMPLETED
      ) {
        await this.linkTransactionToBilling(
          transaction.id,
          data.sourceAccountId,
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
    sourceAccountId?: string,
  ): Promise<TransactionStatus> {
    if (type === TransactionType.EXPENSE && sourceAccountId) {
      const account = await this.prismaService.account.findUnique({
        where: { id: sourceAccountId },
      });

      if (account?.type === AccountType.CREDIT_CARD) {
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
    accountId: string,
    date: Date,
  ) {
    const card = await this.prismaService.accountCard.findUnique({
      where: { accountId },
    });

    if (!card) return;

    // Find the billing for this date
    const billing = await this.prismaService.cardBilling.findFirst({
      where: {
        accountCardId: card.id,
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
    dayOfMonth: number,
    monthOfYear?: number | null,
  ): Date[] {
    const dates: Date[] = [];
    const maxDate =
      endDate || this.addYears(new Date(), this.MAX_GENERATION_YEARS);

    // Get the first occurrence
    let currentDate = this.getFirstOccurrence(
      startDate,
      frequency,
      dayOfMonth,
      monthOfYear,
    );

    while (currentDate <= maxDate) {
      dates.push(new Date(currentDate));

      if (frequency === RecurrenceFrequency.MONTHLY) {
        currentDate = this.addMonths(currentDate, 1);
      } else {
        currentDate = this.addYears(currentDate, 1);
      }
    }

    return dates;
  }

  /**
   * Calculates the first occurrence based on start date and recurrence settings
   */
  private getFirstOccurrence(
    startDate: Date,
    frequency: RecurrenceFrequency,
    dayOfMonth: number,
    monthOfYear?: number | null,
  ): Date {
    const start = new Date(startDate);
    const year = start.getFullYear();
    let month = start.getMonth();

    if (frequency === RecurrenceFrequency.YEARLY && monthOfYear) {
      month = monthOfYear - 1; // Convert 1-12 to 0-11
    }

    let firstOccurrence = new Date(year, month, dayOfMonth);

    // If the calculated date is before start date, move to next period
    if (firstOccurrence < start) {
      if (frequency === RecurrenceFrequency.MONTHLY) {
        firstOccurrence = this.addMonths(firstOccurrence, 1);
      } else {
        firstOccurrence = this.addYears(firstOccurrence, 1);
      }
    }

    return firstOccurrence;
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
    const transactionUpdates: Prisma.TransactionUpdateManyMutationInput = {};

    if (updates.description) {
      transactionUpdates.description = updates.description;
    }
    if (updates.estimatedAmount) {
      transactionUpdates.amount = updates.estimatedAmount;
    }
    if (updates.paymentMethod) {
      transactionUpdates.paymentMethod = updates.paymentMethod as PaymentMethod;
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
    const recurringUpdates: Prisma.RecurringTransactionUpdateInput = {};
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
      dayOfMonth: number;
      monthOfYear: number | null;
      description: string;
      estimatedAmount: Prisma.Decimal;
      type: TransactionType;
      paymentMethod: PaymentMethod | null;
      sourceAccountId: string | null;
      destinyAccountId: string | null;
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
        const newOccurrences = this.calculateOccurrences(
          this.addMonths(
            lastTransaction.date,
            recurring.frequency === RecurrenceFrequency.MONTHLY ? 1 : 0,
          ),
          newMaxDate,
          recurring.frequency,
          recurring.dayOfMonth,
          recurring.monthOfYear,
        ).filter((d) => d > lastTransaction.date);

        const baseStatus = await this.determineStatus(
          recurring.type,
          recurring.sourceAccountId,
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
      const newOccurrences = this.calculateOccurrences(
        oldEndDate,
        newEndDate,
        recurring.frequency,
        recurring.dayOfMonth,
        recurring.monthOfYear,
      ).filter((d) => d > oldEndDate);

      const baseStatus = await this.determineStatus(
        recurring.type,
        recurring.sourceAccountId,
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
   * Deletes a recurring transaction (keeps generated transactions)
   */
  async delete(recurringId: string, userId: string) {
    // First, unlink all transactions
    await this.prismaService.transaction.updateMany({
      where: { recurringTransactionId: recurringId },
      data: { recurringTransactionId: null },
    });

    return this.prismaService.recurringTransaction.delete({
      where: { id: recurringId, userId },
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
}
