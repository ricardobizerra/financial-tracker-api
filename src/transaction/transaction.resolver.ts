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
  AccountType,
  CardBillingStatus,
  CardType,
  PaymentMethod,
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

@Resolver(() => TransactionModel)
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
    // Calcular status baseado na data se não foi informado
    let calculatedStatus = data.status;
    if (!calculatedStatus) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const transactionDate = new Date(data.date);
      transactionDate.setHours(0, 0, 0, 0);

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

      // Prevent income transactions to investment or savings accounts
      if (
        data.type === TransactionType.INCOME &&
        (destinyAccount.type === AccountType.INVESTMENT ||
          destinyAccount.type === AccountType.SAVINGS)
      ) {
        throw new Error(
          'Contas de investimento e poupança não podem receber receitas. Use uma transferência entre contas.',
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

      // Prevent expense transactions from investment or savings accounts
      if (
        data.type === TransactionType.EXPENSE &&
        (sourceAccount.type === AccountType.INVESTMENT ||
          sourceAccount.type === AccountType.SAVINGS)
      ) {
        throw new Error(
          'Contas de investimento e poupança não podem ter despesas. Use uma transferência entre contas.',
        );
      }

      // Prevent card accounts from between-accounts transactions
      if (data.type === TransactionType.BETWEEN_ACCOUNTS) {
        if (sourceAccount.type === AccountType.CREDIT_CARD) {
          throw new Error(
            'Contas de cartão não podem participar de transferências entre contas.',
          );
        }
        if (destinyAccount?.type === AccountType.CREDIT_CARD) {
          throw new Error(
            'Contas de cartão não podem participar de transferências entre contas.',
          );
        }
      }
    }

    // Calcular paymentMethod se não foi informado
    let calculatedPaymentMethod = data.paymentMethod;
    let isDebitCard = false;

    if (!calculatedPaymentMethod) {
      const relevantAccount = sourceAccount || destinyAccount;
      if (relevantAccount?.type === AccountType.CREDIT_CARD) {
        // Para contas de cartão, buscar o tipo do cartão (credit/debit)
        const card = await this.cardService.find({
          accountId: relevantAccount.id,
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

    if (isCardPaymentMethod) {
      const relevantAccount = sourceAccount || destinyAccount;
      if (relevantAccount && relevantAccount.type !== AccountType.CREDIT_CARD) {
        throw new Error(
          'Credit card and debit card payment methods can only be used with card-type accounts.',
        );
      }
    }

    let cardBillingId: string | null = null;

    // Cartões de débito não usam billing/fatura - débito é imediato na conta
    if (
      data.type === TransactionType.EXPENSE &&
      sourceAccount.type === AccountType.CREDIT_CARD &&
      !isDebitCard
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
      status: calculatedStatus,
      type: data.type,
      paymentMethod: calculatedPaymentMethod,
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
  @Mutation(() => TransactionModel, { name: 'createInstallmentTransaction' })
  async createInstallmentTransaction(
    @Args('data') data: CreateInstallmentTransactionInput,
    @CurrentUser() user: UserModel,
  ): Promise<TransactionModel> {
    // Validar conta de origem (deve ser cartão de crédito)
    const sourceAccount = await this.accountService.find({
      id: data.sourceAccountId,
    });

    if (!sourceAccount) {
      throw new Error('Conta de origem não encontrada');
    }

    if (sourceAccount.type !== AccountType.CREDIT_CARD) {
      throw new Error(
        'Transações parceladas só podem ser feitas com cartão de crédito',
      );
    }

    // Buscar cartão
    const card = await this.cardService.find({
      accountId: sourceAccount.id,
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

    // Calcular valor de cada parcela
    const totalAmount = data.totalAmount;
    const installmentAmount = Number(data.totalAmount) / data.totalInstallments;

    // Criar a transação pai com status COMPLETED (compras parceladas são efetivadas)
    const transaction = await this.transactionService.create({
      amount: totalAmount,
      description: data.description,
      date: data.startDate,
      status: TransactionStatus.COMPLETED,
      type: TransactionType.EXPENSE,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      sourceAccount: {
        connect: { id: data.sourceAccountId },
      },
      user: {
        connect: { id: user.id },
      },
    });

    // Criar parcelas
    const billingIdsToUpdate = new Set<string>();

    // Buscar a primeira fatura existente no banco para este cartão
    const firstBilling = await this.prismaService.cardBilling.findFirst({
      where: { accountCardId: card.id },
      orderBy: { periodStart: 'asc' },
    });

    for (let i = 0; i < data.totalInstallments; i++) {
      const installmentNumber = i + 1;

      // Calcular data da parcela
      const installmentDate = new Date(data.startDate);
      installmentDate.setMonth(installmentDate.getMonth() + i);

      // Se a data da parcela é anterior à primeira fatura existente, não atribuir a nenhuma fatura
      if (firstBilling && installmentDate < firstBilling.periodStart) {
        // Criar TransactionInstallment sem fatura
        await this.prismaService.transactionInstallment.create({
          data: {
            installmentNumber,
            amount: installmentAmount,
            transactionId: transaction.id,
            cardBillingId: null,
          },
        });
        continue;
      }

      // Encontrar ou criar fatura para esta data
      let billing = await this.prismaService.cardBilling.findFirst({
        where: {
          accountCardId: card.id,
          periodStart: { lte: installmentDate },
          OR: [{ periodEnd: { gte: installmentDate } }, { periodEnd: null }],
        },
      });

      if (!billing) {
        // Buscar última fatura para criar a próxima
        const lastBilling = await this.prismaService.cardBilling.findFirst({
          where: { accountCardId: card.id },
          orderBy: { periodEnd: 'desc' },
        });

        // Para criar o próximo billing, usar o dia seguinte ao periodEnd do último billing
        // Isso garante que o novo billing seja para o próximo ciclo
        let nextBillingStartDate = installmentDate;
        if (lastBilling?.periodEnd) {
          nextBillingStartDate = new Date(lastBilling.periodEnd);
          nextBillingStartDate.setDate(nextBillingStartDate.getDate() + 1);
        }

        billing = await this.cardService.createBilling({
          cardId: card.id,
          cardBillingCycleDay: card.billingCycleDay,
          cardBillingPaymentDay: card.billingPaymentDay,
          periodStart: nextBillingStartDate,
          limit: card.defaultLimit,
        });
      }

      // Criar TransactionInstallment
      await this.prismaService.transactionInstallment.create({
        data: {
          installmentNumber,
          amount: installmentAmount,
          transactionId: transaction.id,
          cardBillingId: billing.id,
        },
      });

      billingIdsToUpdate.add(billing.id);
    }

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

    const isCanceled =
      existingTransaction.status === TransactionStatus.CANCELED;
    const hasInstallments = existingTransaction.installments.length > 0;

    // Única regra de bloqueio: transações CANCELED só podem ter descrição editada
    if (isCanceled) {
      if (
        data.amount !== undefined ||
        data.date !== undefined ||
        data.paymentMethod !== undefined ||
        data.status !== undefined
      ) {
        throw new Error(
          'Transações canceladas só podem ter a descrição editada',
        );
      }

      const updatedTransaction = await this.transactionService.update(data.id, {
        ...(data.description !== undefined && {
          description: data.description,
        }),
      });

      return updatedTransaction;
    }

    // Calcular novo status baseado na data (transição automática)
    let newStatus: TransactionStatus | undefined = data.status as
      | TransactionStatus
      | undefined;
    const newDate = data.date ?? existingTransaction.date;

    // Normalizar datas para comparação (apenas data, sem horário)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const transactionDate = new Date(newDate);
    transactionDate.setHours(0, 0, 0, 0);

    // Transição automática de status se a data for alterada
    if (data.date !== undefined) {
      if (transactionDate <= today) {
        // Data passada ou hoje -> COMPLETED
        if (
          existingTransaction.status === TransactionStatus.PLANNED ||
          existingTransaction.status === TransactionStatus.OVERDUE
        ) {
          newStatus = TransactionStatus.COMPLETED;
        }
      } else {
        // Data futura -> PLANNED
        if (existingTransaction.status === TransactionStatus.COMPLETED) {
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
      ...(newStatus !== undefined && {
        status: newStatus,
      }),
    });

    // Coletar billings para recalcular
    const billingIdsToUpdate = new Set<string>();

    // Se o valor foi alterado e há parcelas, recalcular os valores das parcelas
    if (
      data.amount !== undefined &&
      hasInstallments &&
      Number(data.amount) !== Number(existingTransaction.amount)
    ) {
      const newInstallmentAmount =
        Number(data.amount) / existingTransaction.installments.length;

      // Atualizar cada parcela
      for (const installment of existingTransaction.installments) {
        await this.prismaService.transactionInstallment.update({
          where: { id: installment.id },
          data: { amount: newInstallmentAmount },
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
  @Mutation(() => TransactionModel, { name: 'cancelTransaction' })
  async cancelTransaction(
    @CurrentUser() user: UserModel,
    @Args('id') id: string,
  ): Promise<TransactionModel> {
    // Buscar transação com cardBilling e dados de parcela
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      include: {
        cardBilling: { select: { status: true } },
        sourceAccount: { select: { type: true } },
      },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    if (transaction.userId !== user.id) {
      throw new Error('Transação não pertence ao usuário');
    }

    // Não permite cancelar transação já cancelada
    if (transaction.status === TransactionStatus.CANCELED) {
      throw new Error('Transação já está cancelada');
    }

    // Se é uma transação parcelada (tem installments associados)
    const installments =
      await this.prismaService.transactionInstallment.findMany({
        where: { transactionId: id },
        include: { cardBilling: { select: { id: true, status: true } } },
        orderBy: { installmentNumber: 'asc' },
      });

    if (installments.length > 0) {
      // Verificar se a primeira parcela está em fatura fechada
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
          throw new Error(
            'Não é possível cancelar este parcelamento pois a primeira parcela está em uma fatura fechada ou paga',
          );
        }
      }

      // Coletar billing IDs para recalcular
      const billingIdsToUpdate = new Set<string>();
      installments.forEach((i) => {
        if (i.cardBillingId) {
          billingIdsToUpdate.add(i.cardBillingId);
        }
      });

      // Cancelar a transação pai
      await this.transactionService.update(id, {
        status: TransactionStatus.CANCELED,
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
      });
    }

    // Transação única (não-parcela)

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
