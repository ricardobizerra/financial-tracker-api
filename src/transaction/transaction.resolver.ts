import {
  Mutation,
  Query,
  Resolver,
  Args,
  Info,
  ID,
  Int,
} from '@nestjs/graphql';
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
  CardBillingStatus,
  CardType,
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { CreateTransactionInput } from './input/create-transaction.input';
import { CreateInstallmentTransactionInput } from './input/create-installment-transaction.input';
import { UpdateTransactionInput } from './input/update-transaction.input';
import { RescheduleTransactionInput } from './input/reschedule-transaction.input';
import {
  UpdateRecurringTransactionsInput,
  UpdateRecurringScope,
} from './input/update-recurring-transactions.input';
import { BulkUpdateTransactionsInput } from './input/bulk-update-transactions.input';
import { BulkDeleteTransactionsInput } from './input/bulk-delete-transactions.input';
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
import { TransactionGroupModel } from './transaction-group.model';
import { Card } from '@/lib/graphql/prisma-client';
import { SimulateBalanceForecastInput } from './input/simulation.input';

@Resolver(() => TransactionModel)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly cardService: CardService,
    private readonly prismaService: PrismaService,
  ) {}

  private distributeInstallmentAmounts(
    totalAmount: number,
    totalInstallments: number,
  ): number[] {
    const totalCents = Math.round(totalAmount);
    const baseCents = Math.floor(totalCents / totalInstallments);
    const remainder = totalCents % totalInstallments;

    return Array.from({ length: totalInstallments }, (_, i) => {
      const cents = baseCents + (i < remainder ? 1 : 0);
      return cents;
    });
  }

  @Auth()
  @Mutation(() => [TransactionModel], { name: 'bulkUpdateTransactions' })
  async bulkUpdateTransactions(
    @CurrentUser() user: UserModel,
    @Args('data') data: BulkUpdateTransactionsInput,
  ): Promise<TransactionModel[]> {
    const updatedTransactions: TransactionModel[] = [];

    // Processar sequencialmente para evitar condições de corrida (ex: recálculo de faturas simultâneas)
    for (const id of data.ids) {
      const result = await this.updateTransaction(
        {
          id,
          category: data.category,
          status: data.status,
          sourceAccountId: data.sourceAccountId,
          date: data.date,
          paymentMethod: data.paymentMethod,
        },
        user,
      );
      updatedTransactions.push(result as any);
    }

    return updatedTransactions;
  }

  @Auth()
  @Mutation(() => [TransactionModel], { name: 'bulkDeleteTransactions' })
  async bulkDeleteTransactions(
    @CurrentUser() user: UserModel,
    @Args('data') data: BulkDeleteTransactionsInput,
  ): Promise<TransactionModel[]> {
    const deletedTransactions: TransactionModel[] = [];

    // Processar sequencialmente para evitar condições de corrida no cardBilling
    for (const id of data.ids) {
      const result = await this.deleteTransaction(user, id);
      deletedTransactions.push(result as any);
    }

    return deletedTransactions;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'createTransaction' })
  async createTransaction(
    @Args('data') data: CreateTransactionInput,
    @CurrentUser() user: UserModel,
  ) {
    // Calcular datas para comparação
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const transactionDate = new Date(data.date);
    transactionDate.setHours(0, 0, 0, 0);

    // Calcular status baseado na data se não foi informado
    let calculatedStatus = data.status;
    if (!calculatedStatus) {
      if (transactionDate > today) {
        // Data futura -> PLANNED
        calculatedStatus = TransactionStatus.PLANNED;
      } else if (transactionDate < today) {
        // Data passada -> COMPLETED
        calculatedStatus = TransactionStatus.COMPLETED;
      } else {
        // Data é hoje -> depende do isCompleted
        calculatedStatus = data.isCompleted
          ? TransactionStatus.COMPLETED
          : TransactionStatus.PLANNED;
      }
    }

    if (calculatedStatus === TransactionStatus.OVERDUE) {
      throw new Error(
        'OVERDUE status cannot be set manually. It is calculated by the system.',
      );
    }

    // Rejeitar COMPLETED para datas futuras e PLANNED para datas passadas
    if (
      calculatedStatus === TransactionStatus.COMPLETED &&
      transactionDate > today
    ) {
      throw new Error(
        'Transactions with future dates cannot be marked as COMPLETED.',
      );
    }

    if (
      calculatedStatus === TransactionStatus.PLANNED &&
      transactionDate < today
    ) {
      throw new Error(
        'Transactions with past dates cannot be marked as PLANNED.',
      );
    }

    const hasDestiny = !!data.destinyAccountId;
    const hasSource = !!data.sourceAccountId || !!data.sourceCardId;

    if (data.type === TransactionType.INCOME && !hasDestiny) {
      throw new Error('Destiny account is mandatory for income transactions');
    }

    if (data.type === TransactionType.EXPENSE && !hasSource) {
      throw new Error('Source account is mandatory for expense transactions');
    }

    if (
      data.type === TransactionType.BETWEEN_ACCOUNTS &&
      !hasSource &&
      !hasDestiny
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
    }

    let sourceAccount: Account | null = null;
    let sourceCard: Card | null = null;

    if (
      data.type === TransactionType.EXPENSE ||
      data.type === TransactionType.BETWEEN_ACCOUNTS
    ) {
      if (data.sourceAccountId) {
        sourceAccount = await this.accountService.find({
          id: data.sourceAccountId,
        });
      } else if (data.sourceCardId) {
        sourceCard = await this.cardService.find({
          id: data.sourceCardId,
        });
      }

      if (!sourceAccount && !sourceCard) {
        throw new Error('Source account or card not found');
      }

      // Prevent card accounts from between-accounts transactions
      if (data.type === TransactionType.BETWEEN_ACCOUNTS && sourceCard) {
        throw new Error(
          'Cards cannot be used in between-accounts transactions.',
        );
      }
    }

    // Calcular paymentMethod se não foi informado
    let calculatedPaymentMethod = data.paymentMethod;
    let isDebitCard = false;

    if (!calculatedPaymentMethod) {
      if (sourceCard) {
        // Para contas de cartão, buscar o tipo do cartão (credit/debit)
        const card = await this.cardService.find({
          id: sourceCard.id,
        });

        if (card?.type === CardType.DEBIT) {
          calculatedPaymentMethod = PaymentMethod.DEBIT_CARD;
          isDebitCard = true;
        } else {
          calculatedPaymentMethod = PaymentMethod.CREDIT_CARD;
        }
      } else {
        // Para outras contas, usar PIX como padrão
        calculatedPaymentMethod = PaymentMethod.PIX;
      }
    }

    // Validar tipo de transação para cartões de débito
    // Cartões de débito só podem ter despesas (não receitas ou transferências)
    if (isDebitCard && data.type !== TransactionType.EXPENSE) {
      throw new Error('Cartões de débito só podem ser usados para despesas.');
    }

    // Validate payment method based on account type
    const isCardPaymentMethod =
      calculatedPaymentMethod === PaymentMethod.CREDIT_CARD ||
      calculatedPaymentMethod === PaymentMethod.DEBIT_CARD;

    if (isCardPaymentMethod && !sourceCard) {
      throw new Error(
        'Credit card and debit card payment methods can only be used with card-type accounts.',
      );
    }

    let cardBillingId: string | null = null;

    // Despesas no cartão de crédito devem ser associadas à fatura do ciclo da data da transação
    if (
      data.type === TransactionType.EXPENSE &&
      sourceCard &&
      calculatedPaymentMethod === PaymentMethod.CREDIT_CARD
    ) {
      const billing = await this.cardService.findOrCreateBillingForDate({
        cardId: sourceCard.id,
        billingCycleDay: sourceCard.billingCycleDay,
        billingPaymentDay: sourceCard.billingPaymentDay,
        limit: sourceCard.defaultLimit,
        date: new Date(data.date),
      });
      cardBillingId = billing.id;
    }

    const transaction = await this.transactionService.create({
      amount: data.amount,
      description: data.description,
      date: data.date,
      status: calculatedStatus,
      type: data.type,
      paymentMethod: calculatedPaymentMethod,
      category: data.category,
      ...((data.type === TransactionType.EXPENSE ||
        data.type === TransactionType.BETWEEN_ACCOUNTS) &&
        data.sourceAccountId && {
          sourceAccount: {
            connect: {
              id: data.sourceAccountId,
            },
          },
        }),
      ...(data.type === TransactionType.EXPENSE &&
        data.sourceCardId && {
          sourceCard: {
            connect: {
              id: data.sourceCardId,
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
  @Mutation(() => TransactionModel, { name: 'createInstallmentTransaction' })
  async createInstallmentTransaction(
    @Args('data') data: CreateInstallmentTransactionInput,
    @CurrentUser() user: UserModel,
  ): Promise<TransactionModel> {
    // Validar conta de origem (deve ser cartão de crédito)
    const card = await this.cardService.find({
      id: data.sourceCardId,
    });

    if (!card) {
      throw new Error('Cartão não encontrado');
    }

    // Cartões de débito não podem ter parcelamento
    if (card.type === CardType.DEBIT) {
      throw new Error(
        'Transações parceladas não são permitidas para cartões de débito',
      );
    }

    const totalAmount = Number(data.totalAmount);
    const installmentAmounts = this.distributeInstallmentAmounts(
      totalAmount,
      data.totalInstallments,
    );

    // Criar a transação pai com status COMPLETED (compras parceladas são efetivadas)
    const transaction = await this.transactionService.create({
      amount: data.totalAmount,
      description: data.description,
      date: data.startDate,
      status: TransactionStatus.COMPLETED,
      type: TransactionType.EXPENSE,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      sourceCard: {
        connect: { id: data.sourceCardId },
      },
      user: {
        connect: { id: user.id },
      },
    });

    // Criar parcelas
    const billingIdsToUpdate = new Set<string>();

    for (let i = 0; i < data.totalInstallments; i++) {
      const installmentNumber = i + 1;

      // Calcular data da parcela
      const installmentDate = new Date(data.startDate);
      installmentDate.setMonth(installmentDate.getMonth() + i);
      const billing = await this.cardService.findOrCreateBillingForDate({
        cardId: card.id,
        billingCycleDay: card.billingCycleDay,
        billingPaymentDay: card.billingPaymentDay,
        limit: card.defaultLimit,
        date: installmentDate,
      });

      // Criar TransactionInstallment
      await this.prismaService.transactionInstallment.create({
        data: {
          installmentNumber,
          amount: installmentAmounts[i],
          transactionId: transaction.id,
          cardBillingId: billing.id,
        },
      });

      billingIdsToUpdate.add(billing.id);
    }

    await this.cardService.syncParentTransactionBillingFromFirstInstallment(
      transaction.id,
    );

    // Recalcular saldo de todas as faturas afetadas
    await Promise.all(
      Array.from(billingIdsToUpdate).map(async (billingId) => {
        await this.cardService.updatePaymentTransaction(billingId);
      }),
    );

    return transaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'updateTransaction' })
  async updateTransaction(
    @Args('data') data: UpdateTransactionInput,
    @CurrentUser() user: UserModel,
  ) {
    // Buscar transação existente com installments
    const existingTransaction = await this.prismaService.transaction.findUnique(
      {
        where: { id: data.id },
        include: {
          cardBilling: true,
          billingPayment: {
            select: { id: true, status: true },
          },
          installments: {
            include: {
              cardBilling: { select: { id: true, status: true } },
            },
            orderBy: { installmentNumber: 'asc' },
          },
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

    const hasInstallments = existingTransaction.installments.length > 0;

    // Calcular novo status baseado na data (transição automática)
    let newStatus: TransactionStatus | undefined = data.status as
      | TransactionStatus
      | undefined;
    const newDate = data.date ?? existingTransaction.date;

    // Normalizar datas para comparação (apenas data, sem horário, em GMT-3)
    const today = new Date();
    today.setUTCHours(today.getUTCHours() - 3);
    today.setUTCHours(0, 0, 0, 0);

    const transactionDate = new Date(newDate);
    transactionDate.setUTCHours(transactionDate.getUTCHours() - 3);
    transactionDate.setUTCHours(0, 0, 0, 0);

    // Transição automática de status se a data for alterada
    if (data.date !== undefined) {
      if (transactionDate < today) {
        // Data passada -> COMPLETED
        if (
          existingTransaction.status === TransactionStatus.PLANNED ||
          existingTransaction.status === TransactionStatus.OVERDUE
        ) {
          newStatus = TransactionStatus.COMPLETED;
        }
      } else if (transactionDate.getTime() === today.getTime()) {
        // Data é hoje -> depende do isCompleted enviado pelo usuário
        if (
          existingTransaction.status === TransactionStatus.PLANNED ||
          existingTransaction.status === TransactionStatus.OVERDUE
        ) {
          newStatus = data.isCompleted
            ? TransactionStatus.COMPLETED
            : TransactionStatus.PLANNED;
        }
      } else {
        // Data futura -> PLANNED
        if (
          existingTransaction.status === TransactionStatus.COMPLETED ||
          existingTransaction.status === TransactionStatus.OVERDUE
        ) {
          newStatus = TransactionStatus.PLANNED;
        }
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
      ...(data.category !== undefined && { category: data.category }),
      ...(data.sourceAccountId !== undefined && {
        sourceAccountId: data.sourceAccountId,
      }),
      ...(data.destinyAccountId !== undefined && {
        destinyAccountId: data.destinyAccountId,
      }),
      ...(newStatus !== undefined && {
        status: newStatus,
      }),
    });

    // Se esta transação é o pagamento de uma fatura e acabou de virar COMPLETED,
    // marcar a fatura como PAID imediatamente (sem esperar o cron de meia-noite).
    const wasJustCompleted =
      newStatus === TransactionStatus.COMPLETED &&
      existingTransaction.status !== TransactionStatus.COMPLETED;

    if (
      wasJustCompleted &&
      existingTransaction.billingPayment &&
      (existingTransaction.billingPayment.status === CardBillingStatus.CLOSED ||
        existingTransaction.billingPayment.status === CardBillingStatus.OVERDUE)
    ) {
      await this.cardService.markBillingPaid(
        existingTransaction.billingPayment.id,
      );
    }

    // Coletar billings para recalcular
    const billingIdsToUpdate = new Set<string>();

    // Se o valor foi alterado e há parcelas, recalcular os valores das parcelas
    if (
      data.amount !== undefined &&
      hasInstallments &&
      Number(data.amount) !== Number(existingTransaction.amount)
    ) {
      const redistributedAmounts = this.distributeInstallmentAmounts(
        Number(data.amount),
        existingTransaction.installments.length,
      );

      // Atualizar cada parcela
      for (const [
        idx,
        installment,
      ] of existingTransaction.installments.entries()) {
        await this.prismaService.transactionInstallment.update({
          where: { id: installment.id },
          data: { amount: redistributedAmounts[idx] },
        });

        if (installment.cardBillingId) {
          billingIdsToUpdate.add(installment.cardBillingId);
        }
      }
    }

    // Se o valor foi alterado e tem cardBilling direto, adicionar para recálculo
    if (
      data.amount !== undefined &&
      existingTransaction.cardBillingId &&
      Number(data.amount) !== Number(existingTransaction.amount)
    ) {
      billingIdsToUpdate.add(existingTransaction.cardBillingId);
    }

    // Recalcular saldo de todas as faturas afetadas
    if (billingIdsToUpdate.size > 0) {
      await Promise.all(
        Array.from(billingIdsToUpdate).map(async (billingId) => {
          await this.cardService.updatePaymentTransaction(billingId);
        }),
      );
    }

    return updatedTransaction;
  }

  @Auth()
  @Mutation(() => TransactionModel, { name: 'deleteTransaction' })
  async deleteTransaction(
    @CurrentUser() user: UserModel,
    @Args('id') id: string,
  ): Promise<TransactionModel> {
    // Buscar transação com dados de parcela
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    // Verificar se é uma transação parcelada (tem installments associados)
    const installments =
      await this.prismaService.transactionInstallment.findMany({
        where: { transactionId: id },
        include: { cardBilling: { select: { id: true } } },
        orderBy: { installmentNumber: 'asc' },
      });

    if (installments.length > 0) {
      // Coletar billing IDs para recalcular
      const billingIdsToUpdate = new Set<string>();
      installments.forEach((i) => {
        if (i.cardBillingId) {
          billingIdsToUpdate.add(i.cardBillingId);
        }
      });

      // Marcar a transação pai como excluída
      await this.transactionService.update(id, {
        deletedAt: new Date(),
      });

      // Recalcular saldo de todas as faturas afetadas
      await Promise.all(
        Array.from(billingIdsToUpdate).map(async (billingId) => {
          await this.cardService.updatePaymentTransaction(billingId);
        }),
      );

      // Retornar a transação atualizada
      return this.prismaService.transaction.findUnique({
        where: { id },
      }) as any;
    }

    // Transação única (não-parcela)
    const updatedTransaction = await this.transactionService.update(id, {
      deletedAt: new Date(),
    });

    // Recalcular saldo da fatura se a transação estava vinculada a uma
    if (transaction.cardBillingId) {
      await this.cardService.updatePaymentTransaction(
        transaction.cardBillingId,
      );
    }

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
  @Mutation(() => TransactionModel, { name: 'deleteRecurringTransactions' })
  async deleteRecurringTransactions(
    @CurrentUser() user: UserModel,
    @Args('transactionId') transactionId: string,
    @Args('scope', { type: () => UpdateRecurringScope }) scope: UpdateRecurringScope,
  ): Promise<TransactionModel> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    if (!transaction.recurringTransactionId) {
      throw new Error('Transação não faz parte de uma recorrência');
    }

    if (scope === UpdateRecurringScope.THIS_ONLY) {
      const deletedTransaction = await this.deleteTransaction(user, transactionId);
      return deletedTransaction as any;
    }

    const transactionsToDelete = await this.prismaService.transaction.findMany({
      where: {
        recurringTransactionId: transaction.recurringTransactionId,
        userId: user.id,
        status: TransactionStatus.PLANNED,
        ...(scope === UpdateRecurringScope.THIS_AND_FUTURE ? { date: { gte: transaction.date } } : {}),
      },
      select: { id: true, cardBillingId: true },
    });

    if (transactionsToDelete.length === 0) {
      return transaction as any;
    }

    const ids = transactionsToDelete.map(t => t.id);
    const billingIds = new Set(transactionsToDelete.filter(t => t.cardBillingId).map(t => t.cardBillingId as string));

    await this.prismaService.transaction.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });

    await Promise.all(
      Array.from(billingIds).map(async (billingId) => {
        await this.cardService.updatePaymentTransaction(billingId);
      }),
    );

    // Update endDate of the RecurringTransaction so it stops generating if applicable
    if (scope === UpdateRecurringScope.THIS_AND_FUTURE) {
      const yesterday = new Date(transaction.date);
      yesterday.setDate(yesterday.getDate() - 1);
      
      await this.prismaService.recurringTransaction.update({
        where: { id: transaction.recurringTransactionId },
        data: { endDate: yesterday },
      });
    } else if (scope === UpdateRecurringScope.ALL_PLANNED) {
      await this.prismaService.recurringTransaction.update({
        where: { id: transaction.recurringTransactionId },
        data: { endDate: new Date() },
      });
    }

    return this.prismaService.transaction.findUnique({
      where: { id: transactionId },
    }) as any;
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

    // Verificar se é transação recorrente
    if (!transaction.recurringTransactionId) {
      throw new Error('Transação não faz parte de uma recorrência');
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

    // Obter todas as contas relevantes com saldo inicial e data de início
    const accounts = await this.prismaService.account.findMany({
      where: {
        institutionLink: { userId: user.id },
        ...(args.accountId && { id: args.accountId }),
      },
      select: {
        id: true,
        name: true,
        initialBalance: true,
        startDate: true,
        institutionLink: {
          select: {
            institution: {
              select: { color: true },
            },
          },
        },
      },
    });

    const accountBalances = accounts.map((a) => ({
      initialBalance: Number(a.initialBalance || 0),
      startDate: a.startDate ? new Date(a.startDate) : null,
    }));

    // Query investment transactions (FUNDING/REDEMPTION) for balance forecast
    const investmentTransactions =
      await this.prismaService.investmentTransaction.findMany({
        where: {
          role: { in: ['FUNDING', 'REDEMPTION'] },
          investment: {
            institutionLink: {
              userId: user.id,
              ...(args.accountId && { account: { id: args.accountId } }),
            },
          },
        },
        select: {
          amount: true,
          role: true,
          investment: {
            select: {
              startDate: true,
              finishedAt: true,
              institutionLink: {
                select: {
                  account: {
                    select: { id: true, startDate: true },
                  },
                },
              },
            },
          },
        },
      });

    // Map investment transactions into balance events
    const investmentEvents = investmentTransactions
      .filter((tx) => {
        // Only include investments whose startDate >= account startDate
        const accountStart = tx.investment.institutionLink?.account?.startDate;
        if (!accountStart) return false;
        return new Date(tx.investment.startDate) >= new Date(accountStart);
      })

      .map((tx) => ({
        accountId: tx.investment.institutionLink!.account!.id,
        date:
          tx.role === 'FUNDING'
            ? new Date(tx.investment.startDate)
            : tx.investment.finishedAt
              ? new Date(tx.investment.finishedAt)
              : null,
        amount: Number(tx.amount),
        type: tx.role as 'FUNDING' | 'REDEMPTION',
      }))
      .filter(
        (
          event,
        ): event is {
          accountId: string;
          date: Date;
          amount: number;
          type: 'FUNDING' | 'REDEMPTION';
        } => event.date !== null,
      );
    const accountsList = accounts.map((a) => ({
      id: a.id,
      name: a.name,
      color: a.institutionLink?.institution?.color ?? null,
      initialBalance: Number(a.initialBalance || 0),
      startDate: a.startDate ? new Date(a.startDate) : null,
    }));

    const forecastResult = await this.transactionService.getBalanceForecast({
      userId: user.id,
      accountId: args.accountId,
      accounts: accountsList,
      startDate,
      endDate,
      investmentEvents,
    });

    return {
      accountSeries: forecastResult.accountSeries,
      startDate: forecastResult.startDate,
      endDate: forecastResult.endDate,
    };
  }

  @Auth()
  @Query(() => BalanceForecastModel, { name: 'simulateBalanceForecast' })
  async simulateBalanceForecast(
    @Args('input') input: SimulateBalanceForecastInput,
    @CurrentUser() user: UserModel,
  ) {
    const startDate = input.startDate;
    const endDate = input.endDate;

    // Fetch real accounts (same as getBalanceForecast)
    const accounts = await this.prismaService.account.findMany({
      where: {
        institutionLink: { userId: user.id },
        ...(input.accountId && { id: input.accountId }),
      },
      select: {
        id: true,
        name: true,
        initialBalance: true,
        startDate: true,
        institutionLink: {
          select: {
            institution: { select: { color: true } },
          },
        },
      },
    });

    const accountBalances = accounts.map((a) => ({
      initialBalance: Number(a.initialBalance || 0),
      startDate: a.startDate ? new Date(a.startDate) : null,
    }));

    // Fetch real investment transactions (same as getBalanceForecast)
    const investmentTransactions =
      await this.prismaService.investmentTransaction.findMany({
        where: {
          role: { in: ['FUNDING', 'REDEMPTION'] },
          investment: {
            institutionLink: {
              userId: user.id,
              ...(input.accountId && {
                account: { id: input.accountId },
              }),
            },
          },
        },
        select: {
          amount: true,
          role: true,
          investment: {
            select: {
              startDate: true,
              finishedAt: true,
              institutionLink: {
                select: { account: { select: { id: true, startDate: true } } },
              },
            },
          },
        },
      });

    const investmentEvents = investmentTransactions
      .filter((tx) => {
        const accountStart = tx.investment.institutionLink?.account?.startDate;
        if (!accountStart) return false;
        return new Date(tx.investment.startDate) >= new Date(accountStart);
      })
      .map((tx) => ({
        accountId: tx.investment.institutionLink!.account!.id,
        date:
          tx.role === 'FUNDING'
            ? new Date(tx.investment.startDate)
            : tx.investment.finishedAt
              ? new Date(tx.investment.finishedAt)
              : null,
        amount: Number(tx.amount),
        type: tx.role as 'FUNDING' | 'REDEMPTION',
      }))
      .filter(
        (
          event,
        ): event is {
          accountId: string;
          date: Date;
          amount: number;
          type: 'FUNDING' | 'REDEMPTION';
        } => event.date !== null,
      );

    // Expand simulated transactions (one-offs + recurring expanded across date range)
    const expandedSimTxs: {
      description: string;
      amount: number;
      type: TransactionType;
      date: Date;
      isIncome: boolean;
      isSimulated: true;
      accountId?: string | null;
    }[] = [];

    const pushSimTx = (
      simTx: (typeof input.simulatedTransactions)[0],
      targetDate: Date,
    ) => {
      if (simTx.type === TransactionType.BETWEEN_ACCOUNTS) {
        expandedSimTxs.push({
          description: simTx.description,
          amount: simTx.amount,
          type: simTx.type,
          date: targetDate,
          isIncome: false,
          isSimulated: true,
          accountId: simTx.accountId,
        });
        if (simTx.destinyAccountId) {
          expandedSimTxs.push({
            description: simTx.description,
            amount: simTx.amount,
            type: simTx.type,
            date: targetDate,
            isIncome: true,
            isSimulated: true,
            accountId: simTx.destinyAccountId,
          });
        }
      } else {
        expandedSimTxs.push({
          description: simTx.description,
          amount: simTx.amount,
          type: simTx.type,
          date: targetDate,
          isIncome: simTx.type === TransactionType.INCOME,
          isSimulated: true,
          accountId: simTx.accountId,
        });
      }
    };

    for (const simTx of input.simulatedTransactions) {
      if (!simTx.isRecurring) {
        if (simTx.date >= startDate && simTx.date <= endDate) {
          pushSimTx(simTx, simTx.date);
        }
      } else if (simTx.recurrenceFrequency) {
        const recEndDate = simTx.recurrenceEndDate
          ? new Date(
              Math.min(
                new Date(simTx.recurrenceEndDate).getTime(),
                endDate.getTime(),
              ),
            )
          : endDate;

        const occurrenceDate = new Date(simTx.date);
        while (occurrenceDate <= recEndDate) {
          if (occurrenceDate >= startDate) {
            pushSimTx(simTx, new Date(occurrenceDate));
          }

          switch (simTx.recurrenceFrequency) {
            case RecurrenceFrequency.WEEKLY:
              occurrenceDate.setDate(occurrenceDate.getDate() + 7);
              break;
            case RecurrenceFrequency.BI_WEEKLY:
              occurrenceDate.setDate(occurrenceDate.getDate() + 14);
              break;
            case RecurrenceFrequency.MONTHLY:
              occurrenceDate.setMonth(occurrenceDate.getMonth() + 1);
              break;
            case RecurrenceFrequency.YEARLY:
              occurrenceDate.setFullYear(occurrenceDate.getFullYear() + 1);
              break;
            default:
              occurrenceDate.setMonth(occurrenceDate.getMonth() + 1);
          }
        }
      }
    }

    // Add simulated investments as expense events (capital outflow)
    for (const simInv of input.simulatedInvestments) {
      const invDate = new Date(simInv.startDate);
      if (invDate >= startDate && invDate <= endDate) {
        expandedSimTxs.push({
          description: `Investimento: ${simInv.description}`,
          amount: simInv.initialAmount,
          type: TransactionType.EXPENSE,
          date: invDate,
          isIncome: false,
          isSimulated: true,
          accountId: simInv.accountId,
        });
      }
    }

    const accountsList = accounts.map((a) => ({
      id: a.id,
      name: a.name,
      color: a.institutionLink?.institution?.color ?? null,
      initialBalance: Number(a.initialBalance || 0),
      startDate: a.startDate ? new Date(a.startDate) : null,
    }));

    const forecastResult =
      await this.transactionService.simulateBalanceForecast({
        userId: user.id,
        accountId: input.accountId,
        accounts: accountsList,
        startDate,
        endDate,
        investmentEvents,
        simulatedTransactions: expandedSimTxs,
      });

    return {
      accountSeries: forecastResult.accountSeries,
      startDate: forecastResult.startDate,
      endDate: forecastResult.endDate,
    };
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

  @Auth()
  @Query(() => [TransactionGroupModel], { name: 'transactionsGroupedByPeriod' })
  async getTransactionsGroupedByPeriod(
    @Args('accountId', { type: () => ID, nullable: true }) accountId: string,
    @Args('limitPerGroup', {
      type: () => Int,
      nullable: true,
      defaultValue: 10,
    })
    limitPerGroup: number,
    @Args() filterArgs: TransactionFilterArgs,
    @CurrentUser() user: UserModel,
  ) {
    return this.transactionService.getTransactionsGroupedByPeriod({
      userId: user.id,
      accountId,
      limitPerGroup,
      startDate: filterArgs.startDate,
      endDate: filterArgs.endDate,
      types: filterArgs.types,
      statuses: filterArgs.statuses,
    });
  }
}
