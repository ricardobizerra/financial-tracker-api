import { Mutation, Query, Resolver, Args, Info } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionConnection, TransactionModel } from './transaction.model';
import { Auth } from '@/auth/auth.decorator';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { OrdenationTransactionArgs } from './transaction.model';
import { GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { TransactionFilterArgs } from './transaction.model';
import {
  Account,
  AccountType,
  CardBillingStatus,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { CreateTransactionInput } from './input/create-transaction.input';
import { UpdateTransactionInput } from './input/update-transaction.input';
import { ConfirmTransactionInput } from './input/confirm-transaction.input';
import { RescheduleTransactionInput } from './input/reschedule-transaction.input';
import {
  UpdateRecurringTransactionsInput,
  UpdateRecurringScope,
} from './input/update-recurring-transactions.input';
import { AccountService } from '@/account/account.service';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { CardService } from '@/card/card.service';
import { TransactionsSummaryModel } from './transactions-summary.model';
import {
  BalanceForecastModel,
  BalanceForecastArgs,
  BalanceForecastPeriod,
} from './balance-forecast.model';
import {
  TransactionsCalendarModel,
  TransactionsCalendarArgs,
} from './transactions-calendar.model';
import {
  FinancialAgendaModel,
  FinancialAgendaArgs,
} from './financial-agenda.model';

@Resolver()
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly cardService: CardService,
    private readonly prismaService: PrismaService,
  ) {}

  @Auth()
  @Mutation(() => TransactionModel, { name: 'createTransaction' })
  async createTransaction(
    @Args('data') data: CreateTransactionInput,
    @CurrentUser() user: UserModel,
  ) {
    if (data.status === TransactionStatus.OVERDUE) {
      throw new Error(
        'OVERDUE status cannot be set manually. It is calculated by the system.',
      );
    }

    if (data.type === TransactionType.INCOME && !data.destinyAccountId) {
      throw new Error('Destiny account is mandatory for income transactions');
    }

    if (data.type === TransactionType.EXPENSE && !data.sourceAccountId) {
      throw new Error('Source account is mandatory for expense transactions');
    }

    if (
      data.type === TransactionType.BETWEEN_ACCOUNTS &&
      !data.sourceAccountId &&
      !data.destinyAccountId
    ) {
      throw new Error(
        'Source and destiny accounts are mandatory for transactions between accounts',
      );
    }

    let destinyAccount: Account | null = null;

    if (
      data.type === TransactionType.INCOME ||
      data.type === TransactionType.BETWEEN_ACCOUNTS
    ) {
      destinyAccount = await this.accountService.find({
        id: data.destinyAccountId,
      });

      if (!destinyAccount) {
        throw new Error('Destiny account not found');
      }

      // Prevent income transactions to credit card accounts
      if (
        data.type === TransactionType.INCOME &&
        destinyAccount.type === AccountType.CREDIT_CARD
      ) {
        throw new Error(
          'Income transactions cannot be assigned to credit card accounts',
        );
      }
    }

    let sourceAccount: Account | null = null;

    if (
      data.type === TransactionType.EXPENSE ||
      data.type === TransactionType.BETWEEN_ACCOUNTS
    ) {
      sourceAccount = await this.accountService.find({
        id: data.sourceAccountId,
      });

      if (!sourceAccount) {
        throw new Error('Source account not found');
      }
    }

    // Validate payment method based on account type
    const isCardPaymentMethod =
      data.paymentMethod === PaymentMethod.CREDIT_CARD ||
      data.paymentMethod === PaymentMethod.DEBIT_CARD;

    if (isCardPaymentMethod) {
      const relevantAccount = sourceAccount || destinyAccount;
      if (relevantAccount && relevantAccount.type !== AccountType.CREDIT_CARD) {
        throw new Error(
          'Credit card and debit card payment methods can only be used with card-type accounts.',
        );
      }
    }

    let cardBillingId: string | null = null;

    if (
      data.type === TransactionType.EXPENSE &&
      sourceAccount.type === AccountType.CREDIT_CARD
    ) {
      const card = await this.cardService.find({
        accountId: sourceAccount.id,
      });

      if (!card) {
        throw new Error('Card not found');
      }

      const billing = await this.prismaService.cardBilling.findFirst({
        where: {
          accountCard: {
            id: card.id,
          },
          periodStart: {
            lte: data.date,
          },
          status: CardBillingStatus.PENDING,
        },
        orderBy: {
          periodStart: 'desc',
        },
      });

      if (billing) {
        cardBillingId = billing.id;
      } else {
        const billing = await this.prismaService.cardBilling.findFirst({
          where: {
            accountCard: {
              id: card.id,
            },
            periodStart: {
              gte: data.date,
            },
            status: CardBillingStatus.PENDING,
          },
        });

        if (billing) {
          cardBillingId = billing.id;
        } else {
          const lastBilling = await this.prismaService.cardBilling.findFirst({
            where: {
              accountCard: {
                id: card.id,
              },
            },
            orderBy: {
              periodEnd: 'desc',
            },
          });

          const billing = await this.cardService.createBilling({
            cardId: card.id,
            cardBillingCycleDay: card.billingCycleDay,
            cardBillingPaymentDay: card.billingPaymentDay,
            periodStart: lastBilling?.periodEnd,
            limit: card.defaultLimit,
          });

          cardBillingId = billing.id;
        }
      }
    }

    const transaction = await this.transactionService.create({
      amount: data.amount,
      description: data.description,
      date: data.date,
      status: data.status,
      type: data.type,
      paymentMethod: data.paymentMethod,
      ...((data.type === TransactionType.EXPENSE ||
        data.type === TransactionType.BETWEEN_ACCOUNTS) && {
        sourceAccount: {
          connect: {
            id: data.sourceAccountId,
          },
        },
      }),
      ...((data.type === TransactionType.INCOME ||
        data.type === TransactionType.BETWEEN_ACCOUNTS) && {
        destinyAccount: {
          connect: {
            id: data.destinyAccountId,
          },
        },
      }),
      user: {
        connect: {
          id: user.id,
        },
      },
      ...(cardBillingId && {
        cardBilling: {
          connect: {
            id: cardBillingId,
          },
        },
      }),
    });

    if (cardBillingId) {
      await this.cardService.updatePaymentTransaction(cardBillingId);
    }

    return transaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'updateTransaction' })
  async updateTransaction(
    @Args('data') data: UpdateTransactionInput,
    @CurrentUser() user: UserModel,
  ) {
    // Buscar transação existente
    const existingTransaction = await this.prismaService.transaction.findUnique(
      {
        where: { id: data.id },
        include: {
          cardBilling: true,
        },
      },
    );

    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    // Validar que a transação pertence ao usuário
    if (existingTransaction.userId !== user.id) {
      throw new Error('Transaction does not belong to user');
    }

    const isCompleted =
      existingTransaction.status === TransactionStatus.COMPLETED;
    const isCanceled =
      existingTransaction.status === TransactionStatus.CANCELED;
    const isImmutable = isCompleted || isCanceled;

    // Para transações COMPLETED ou CANCELED, apenas a descrição pode ser editada
    if (isImmutable) {
      // Verificar se está tentando editar algo além da descrição
      if (
        data.amount !== undefined ||
        data.date !== undefined ||
        data.paymentMethod !== undefined ||
        data.status !== undefined
      ) {
        throw new Error(
          'Transações finalizadas ou canceladas só podem ter a descrição editada',
        );
      }

      // Atualizar apenas descrição
      const updatedTransaction = await this.transactionService.update(data.id, {
        ...(data.description !== undefined && {
          description: data.description,
        }),
      });

      return updatedTransaction;
    }

    // Validar: não editar transação de fatura fechada/paga
    if (existingTransaction.cardBilling) {
      const closedStatuses: CardBillingStatus[] = [
        CardBillingStatus.PAID,
        CardBillingStatus.CLOSED,
        CardBillingStatus.COMPLETED,
      ];
      if (closedStatuses.includes(existingTransaction.cardBilling.status)) {
        throw new Error('Cannot edit transactions from closed or paid billing');
      }
    }

    // Atualizar transação (todos os campos permitidos)
    const updatedTransaction = await this.transactionService.update(data.id, {
      ...(data.description !== undefined && { description: data.description }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.paymentMethod !== undefined && {
        paymentMethod: data.paymentMethod as PaymentMethod,
      }),
      ...(data.status !== undefined && {
        status: data.status as TransactionStatus,
      }),
    });

    return updatedTransaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'confirmTransaction' })
  async confirmTransaction(
    @CurrentUser() user: UserModel,
    @Args('data') data: ConfirmTransactionInput,
  ): Promise<TransactionModel> {
    // Buscar transação com cardBilling
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: data.id },
      include: { cardBilling: true },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    // Validar status atual
    const allowedStatuses: TransactionStatus[] = [
      TransactionStatus.PLANNED,

      TransactionStatus.OVERDUE,
    ];
    if (!allowedStatuses.includes(transaction.status)) {
      throw new Error('Apenas transações pendentes podem ser confirmadas');
    }

    // Validar cardBilling se existir
    if (transaction.cardBilling) {
      const closedStatuses: CardBillingStatus[] = [
        CardBillingStatus.PAID,
        CardBillingStatus.CLOSED,
        CardBillingStatus.COMPLETED,
      ];
      if (closedStatuses.includes(transaction.cardBilling.status)) {
        throw new Error(
          'Não é possível confirmar transação de fatura fechada ou paga',
        );
      }
    }

    // Atualizar transação
    const updatedTransaction = await this.transactionService.update(data.id, {
      status: TransactionStatus.COMPLETED,
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.date !== undefined && { date: data.date }),
    });

    return updatedTransaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'cancelTransaction' })
  async cancelTransaction(
    @CurrentUser() user: UserModel,
    @Args('id') id: string,
  ): Promise<TransactionModel> {
    // Buscar transação com cardBilling
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      include: { cardBilling: true },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    // Validar status atual
    const allowedStatuses: TransactionStatus[] = [
      TransactionStatus.PLANNED,

      TransactionStatus.OVERDUE,
    ];
    if (!allowedStatuses.includes(transaction.status)) {
      throw new Error('Apenas transações pendentes podem ser canceladas');
    }

    // Validar cardBilling se existir
    if (transaction.cardBilling) {
      const closedStatuses: CardBillingStatus[] = [
        CardBillingStatus.PAID,
        CardBillingStatus.CLOSED,
        CardBillingStatus.COMPLETED,
      ];
      if (closedStatuses.includes(transaction.cardBilling.status)) {
        throw new Error(
          'Não é possível cancelar transação de fatura fechada ou paga',
        );
      }
    }

    // Atualizar transação
    const updatedTransaction = await this.transactionService.update(id, {
      status: TransactionStatus.CANCELED,
    });

    return updatedTransaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'rescheduleTransaction' })
  async rescheduleTransaction(
    @CurrentUser() user: UserModel,
    @Args('data') data: RescheduleTransactionInput,
  ): Promise<TransactionModel> {
    // Buscar transação
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: data.id },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    // Apenas PLANNED pode ser reagendada
    if (transaction.status !== TransactionStatus.PLANNED) {
      throw new Error('Apenas transações planejadas podem ser reagendadas');
    }

    // Atualizar transação
    const updatedTransaction = await this.transactionService.update(data.id, {
      date: data.newDate,
    });

    return updatedTransaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'updateRecurringTransactions' })
  async updateRecurringTransactions(
    @CurrentUser() user: UserModel,
    @Args('data') data: UpdateRecurringTransactionsInput,
  ): Promise<TransactionModel> {
    // Buscar transação inicial
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: data.transactionId },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    // THIS_ONLY: usa updateTransaction existente
    if (data.scope === UpdateRecurringScope.THIS_ONLY) {
      const updatedTransaction = await this.transactionService.update(
        data.transactionId,
        {
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.amount !== undefined && { amount: data.amount }),
          ...(data.paymentMethod !== undefined && {
            paymentMethod: data.paymentMethod,
          }),
        },
      );
      return updatedTransaction;
    }

    // Verificar se é transação recorrente
    if (!transaction.recurringTransactionId) {
      throw new Error('Transação não faz parte de uma recorrência');
    }

    // Construir dados de atualização
    const updateData: {
      description?: string;
      amount?: number;
      paymentMethod?: PaymentMethod;
    } = {};
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.paymentMethod !== undefined)
      updateData.paymentMethod = data.paymentMethod;

    if (Object.keys(updateData).length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    // Atualizar transações em batch
    if (data.scope === UpdateRecurringScope.THIS_AND_FUTURE) {
      // Atualizar esta + futuras PLANNED
      await this.prismaService.transaction.updateMany({
        where: {
          recurringTransactionId: transaction.recurringTransactionId,
          userId: user.id,
          status: TransactionStatus.PLANNED,
          date: { gte: transaction.date },
        },
        data: updateData,
      });
    } else if (data.scope === UpdateRecurringScope.ALL_PLANNED) {
      // Atualizar todas PLANNED
      await this.prismaService.transaction.updateMany({
        where: {
          recurringTransactionId: transaction.recurringTransactionId,
          userId: user.id,
          status: TransactionStatus.PLANNED,
        },
        data: updateData,
      });
    }

    // Atualizar RecurringTransaction para futuras gerações
    await this.prismaService.recurringTransaction.update({
      where: { id: transaction.recurringTransactionId },
      data: {
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.amount !== undefined && { estimatedAmount: data.amount }),
        ...(data.paymentMethod !== undefined && {
          paymentMethod: data.paymentMethod,
        }),
      },
    });

    // Retornar transação atualizada
    const updatedTransaction = await this.prismaService.transaction.findUnique({
      where: { id: data.transactionId },
    });

    return updatedTransaction as TransactionModel;
  }

  @Auth()
  @Query(() => TransactionConnection, { name: 'transactions' })
  async findAllTransactions(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationTransactionArgs,
    @Args() filterArgs: TransactionFilterArgs,
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: UserModel,
  ) {
    const queriedFields = getQueriedFields<TransactionModel>(
      info,
      'transactions',
    );

    return this.transactionService.findMany({
      userId: user.id,
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
      filterArgs,
    });
  }

  @Auth()
  @Query(() => TransactionsSummaryModel, { name: 'transactionsSummary' })
  async getTransactionsSummary(
    @Args() searchArgs: SearchArgs,
    @Args() filterArgs: TransactionFilterArgs,
    @CurrentUser() user: UserModel,
  ) {
    return this.transactionService.getSummary({
      userId: user.id,
      filterArgs,
      searchArgs,
    });
  }

  @Auth()
  @Query(() => BalanceForecastModel, { name: 'balanceForecast' })
  async getBalanceForecast(
    @Args() args: BalanceForecastArgs,
    @CurrentUser() user: UserModel,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;

    // Calcular datas baseado no período selecionado
    switch (args.period) {
      case BalanceForecastPeriod.WEEK:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case BalanceForecastPeriod.MONTH:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 30);
        break;
      case BalanceForecastPeriod.THREE_MONTHS:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 90);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 90);
        break;
      case BalanceForecastPeriod.SIX_MONTHS:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 180);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 180);
        break;
      case BalanceForecastPeriod.YEAR:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 365);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 365);
        break;
      case BalanceForecastPeriod.CUSTOM:
        if (!args.startDate || !args.endDate) {
          throw new Error(
            'Start date and end date are required for custom period',
          );
        }
        startDate = args.startDate;
        endDate = args.endDate;
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 90);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 90);
    }

    // Obter saldo inicial da conta (se especificada)
    let initialBalance = 0;
    if (args.accountId) {
      const account = await this.accountService.find({ id: args.accountId });
      if (account) {
        initialBalance = Number(account.initialBalance || 0);
      }
    }

    return this.transactionService.getBalanceForecast({
      userId: user.id,
      accountId: args.accountId,
      startDate,
      endDate,
      initialBalance,
    });
  }

  @Auth()
  @Query(() => TransactionsCalendarModel, { name: 'transactionsCalendar' })
  async getTransactionsCalendar(
    @Args() args: TransactionsCalendarArgs,
    @CurrentUser() user: UserModel,
  ) {
    return this.transactionService.getTransactionsCalendar({
      userId: user.id,
      accountId: args.accountId,
      year: args.year,
      month: args.month,
    });
  }

  @Auth()
  @Query(() => FinancialAgendaModel, { name: 'financialAgenda' })
  async getFinancialAgenda(
    @Args() args: FinancialAgendaArgs,
    @CurrentUser() user: UserModel,
  ) {
    return this.transactionService.getFinancialAgenda({
      userId: user.id,
      accountId: args.accountId,
      daysAhead: args.daysAhead,
    });
  }
}
