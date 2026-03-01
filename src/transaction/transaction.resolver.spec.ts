import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { AccountService } from '@/account/account.service';
import { CardService } from '@/card/card.service';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  TransactionType,
  TransactionStatus,
  CardType,
  CardBillingStatus,
} from '@prisma/client';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let transactionService: any;
  let accountService: any;
  let cardService: any;
  let prismaService: any;

  const mockUser = { id: 'user-1', email: 'test@test.com', name: 'Test User' };

  beforeEach(() => {
    transactionService = {
      create: vi.fn(),
      update: vi.fn(),
      find: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      getSummary: vi.fn(),
    };

    accountService = {
      find: vi.fn(),
    };

    cardService = {
      find: vi.fn(),
      createBilling: vi.fn(),
      updatePaymentTransaction: vi.fn(),
    };

    prismaService = {
      transaction: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        updateMany: vi.fn(),
      },
      transactionInstallment: {
        update: vi.fn(),
      },
      cardBilling: {
        findFirst: vi.fn(),
      },
      recurringTransaction: {
        update: vi.fn(),
      },
      account: {
        findMany: vi.fn(),
      },
    };

    resolver = new TransactionResolver(
      transactionService,
      accountService,
      cardService,
      prismaService,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTransaction', () => {
    describe('status auto-calculation', () => {
      it('should set status to PLANNED for future dates', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);

        accountService.find.mockResolvedValue({ id: 'acc-1' });
        transactionService.create.mockResolvedValue({
          id: 'tx-1',
          status: TransactionStatus.PLANNED,
        });

        await resolver.createTransaction(
          {
            description: 'Future tx',
            amount: 100 as any,
            date: futureDate,
            type: TransactionType.INCOME,
            destinyAccountId: 'acc-1',
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            status: TransactionStatus.PLANNED,
          }),
        );
      });

      it('should set status to COMPLETED for past dates', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);

        accountService.find.mockResolvedValue({ id: 'acc-1' });
        transactionService.create.mockResolvedValue({
          id: 'tx-1',
          status: TransactionStatus.COMPLETED,
        });

        await resolver.createTransaction(
          {
            description: 'Past tx',
            amount: 100 as any,
            date: pastDate,
            type: TransactionType.INCOME,
            destinyAccountId: 'acc-1',
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            status: TransactionStatus.COMPLETED,
          }),
        );
      });

      it('should set status to COMPLETED for today with isCompleted=true', async () => {
        const today = new Date();

        accountService.find.mockResolvedValue({ id: 'acc-1' });
        transactionService.create.mockResolvedValue({
          id: 'tx-1',
          status: TransactionStatus.COMPLETED,
        });

        await resolver.createTransaction(
          {
            description: 'Today completed',
            amount: 100 as any,
            date: today,
            type: TransactionType.INCOME,
            destinyAccountId: 'acc-1',
            isCompleted: true,
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            status: TransactionStatus.COMPLETED,
          }),
        );
      });

      it('should set status to PLANNED for today with isCompleted=false', async () => {
        const today = new Date();

        accountService.find.mockResolvedValue({ id: 'acc-1' });
        transactionService.create.mockResolvedValue({
          id: 'tx-1',
          status: TransactionStatus.PLANNED,
        });

        await resolver.createTransaction(
          {
            description: 'Today planned',
            amount: 100 as any,
            date: today,
            type: TransactionType.INCOME,
            destinyAccountId: 'acc-1',
            isCompleted: false,
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            status: TransactionStatus.PLANNED,
          }),
        );
      });
    });

    describe('status validation', () => {
      it('should reject OVERDUE status', async () => {
        const today = new Date();

        await expect(
          resolver.createTransaction(
            {
              description: 'Test',
              amount: 100 as any,
              date: today,
              type: TransactionType.INCOME,
              destinyAccountId: 'acc-1',
              status: TransactionStatus.OVERDUE,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow('OVERDUE status cannot be set manually');
      });

      it('should reject COMPLETED for future dates', async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);

        await expect(
          resolver.createTransaction(
            {
              description: 'Test',
              amount: 100 as any,
              date: futureDate,
              type: TransactionType.INCOME,
              destinyAccountId: 'acc-1',
              status: TransactionStatus.COMPLETED,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Transactions with future dates cannot be marked as COMPLETED',
        );
      });

      it('should reject PLANNED for past dates', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);

        await expect(
          resolver.createTransaction(
            {
              description: 'Test',
              amount: 100 as any,
              date: pastDate,
              type: TransactionType.INCOME,
              destinyAccountId: 'acc-1',
              status: TransactionStatus.PLANNED,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Transactions with past dates cannot be marked as PLANNED',
        );
      });
    });

    describe('type validations', () => {
      it('should require destinyAccountId for INCOME', async () => {
        const today = new Date();

        await expect(
          resolver.createTransaction(
            {
              description: 'Income without destiny',
              amount: 100 as any,
              date: today,
              type: TransactionType.INCOME,
              isCompleted: true,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Destiny account is mandatory for income transactions',
        );
      });

      it('should require sourceAccountId or sourceCardId for EXPENSE', async () => {
        const today = new Date();

        await expect(
          resolver.createTransaction(
            {
              description: 'Expense without source',
              amount: 100 as any,
              date: today,
              type: TransactionType.EXPENSE,
              isCompleted: true,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Source account is mandatory for expense transactions',
        );
      });

      it('should require both source and destiny for BETWEEN_ACCOUNTS', async () => {
        const today = new Date();

        await expect(
          resolver.createTransaction(
            {
              description: 'Transfer without accounts',
              amount: 100 as any,
              date: today,
              type: TransactionType.BETWEEN_ACCOUNTS,
              isCompleted: true,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Source and destiny accounts are mandatory for transactions between accounts',
        );
      });

      it('should reject cards as source for BETWEEN_ACCOUNTS', async () => {
        const today = new Date();

        accountService.find.mockResolvedValueOnce({ id: 'acc-1' }); // destiny
        cardService.find.mockResolvedValueOnce({
          id: 'card-1',
          type: CardType.CREDIT,
        }); // source card

        await expect(
          resolver.createTransaction(
            {
              description: 'Transfer with card',
              amount: 100 as any,
              date: today,
              type: TransactionType.BETWEEN_ACCOUNTS,
              sourceCardId: 'card-1',
              destinyAccountId: 'acc-1',
              isCompleted: true,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Cards cannot be used in between-accounts transactions',
        );
      });
    });

    describe('payment method', () => {
      it('should auto-detect CREDIT_CARD payment for credit cards', async () => {
        const today = new Date();

        cardService.find
          .mockResolvedValueOnce({
            id: 'card-1',
            type: CardType.CREDIT,
          })
          .mockResolvedValueOnce({
            id: 'card-1',
            type: CardType.CREDIT,
          });
        transactionService.create.mockResolvedValue({ id: 'tx-1' });

        await resolver.createTransaction(
          {
            description: 'Card expense',
            amount: 100 as any,
            date: today,
            type: TransactionType.EXPENSE,
            sourceCardId: 'card-1',
            isCompleted: true,
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            paymentMethod: 'CREDIT_CARD',
          }),
        );
      });

      it('should auto-detect DEBIT_CARD payment for debit cards', async () => {
        const today = new Date();

        cardService.find
          .mockResolvedValueOnce({
            id: 'card-1',
            type: CardType.DEBIT,
          })
          .mockResolvedValueOnce({
            id: 'card-1',
            type: CardType.DEBIT,
          });
        transactionService.create.mockResolvedValue({ id: 'tx-1' });

        await resolver.createTransaction(
          {
            description: 'Debit card expense',
            amount: 100 as any,
            date: today,
            type: TransactionType.EXPENSE,
            sourceCardId: 'card-1',
            isCompleted: true,
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            paymentMethod: 'DEBIT_CARD',
          }),
        );
      });

      it('should default to PIX for regular accounts', async () => {
        const today = new Date();

        accountService.find.mockResolvedValue({ id: 'acc-1' });
        transactionService.create.mockResolvedValue({ id: 'tx-1' });

        await resolver.createTransaction(
          {
            description: 'PIX payment',
            amount: 100 as any,
            date: today,
            type: TransactionType.EXPENSE,
            sourceAccountId: 'acc-1',
            isCompleted: true,
          } as any,
          mockUser as any,
        );

        expect(transactionService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            paymentMethod: 'PIX',
          }),
        );
      });

      it('should reject card payment methods without a card source', async () => {
        const today = new Date();

        accountService.find.mockResolvedValue({ id: 'acc-1' });

        await expect(
          resolver.createTransaction(
            {
              description: 'Invalid card payment',
              amount: 100 as any,
              date: today,
              type: TransactionType.EXPENSE,
              sourceAccountId: 'acc-1',
              paymentMethod: 'CREDIT_CARD',
              isCompleted: true,
            } as any,
            mockUser as any,
          ),
        ).rejects.toThrow(
          'Credit card and debit card payment methods can only be used with card-type accounts',
        );
      });
    });

    describe('debit card billing', () => {
      it('should NOT associate billing for debit card transactions', async () => {
        const today = new Date();

        cardService.find
          .mockResolvedValueOnce({ id: 'card-1', type: CardType.DEBIT })
          .mockResolvedValueOnce({ id: 'card-1', type: CardType.DEBIT });
        transactionService.create.mockResolvedValue({ id: 'tx-1' });

        await resolver.createTransaction(
          {
            description: 'Debit expense',
            amount: 50 as any,
            date: today,
            type: TransactionType.EXPENSE,
            sourceCardId: 'card-1',
            isCompleted: true,
          } as any,
          mockUser as any,
        );

        // Should not call updatePaymentTransaction (no billing)
        expect(cardService.updatePaymentTransaction).not.toHaveBeenCalled();
      });
    });
  });

  describe('createInstallmentTransaction', () => {
    it('should reject debit cards', async () => {
      cardService.find.mockResolvedValue({
        id: 'card-1',
        type: CardType.DEBIT,
      });

      await expect(
        resolver.createInstallmentTransaction(
          {
            description: 'Installment tx',
            totalAmount: 1200 as any,
            totalInstallments: 12,
            startDate: new Date(),
            sourceCardId: 'card-1',
          } as any,
          mockUser as any,
        ),
      ).rejects.toThrow(
        'Transações parceladas não são permitidas para cartões de débito',
      );
    });

    it('should reject when card is not found', async () => {
      cardService.find.mockResolvedValue(null);

      await expect(
        resolver.createInstallmentTransaction(
          {
            description: 'Test',
            totalAmount: 1200 as any,
            totalInstallments: 12,
            startDate: new Date(),
            sourceCardId: 'nonexistent',
          } as any,
          mockUser as any,
        ),
      ).rejects.toThrow('Cartão não encontrado');
    });
  });

  describe('updateTransaction', () => {
    it('should only allow description edit for CANCELED transactions', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.CANCELED,
        installments: [],
      });

      await expect(
        resolver.updateTransaction(
          { id: 'tx-1', amount: 200 } as any,
          mockUser as any,
        ),
      ).rejects.toThrow(
        'Transações canceladas só podem ter a descrição editada',
      );
    });

    it('should allow description edit for CANCELED transactions', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.CANCELED,
        installments: [],
      });
      transactionService.update.mockResolvedValue({
        id: 'tx-1',
        description: 'Updated',
      });

      const result = await resolver.updateTransaction(
        { id: 'tx-1', description: 'Updated' } as any,
        mockUser as any,
      );

      expect(result.description).toBe('Updated');
    });

    it('should throw when transaction not found', async () => {
      prismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(
        resolver.updateTransaction(
          { id: 'nonexistent', description: 'Test' } as any,
          mockUser as any,
        ),
      ).rejects.toThrow('Transaction not found');
    });

    it('should throw when transaction belongs to another user', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'other-user',
        status: TransactionStatus.COMPLETED,
        installments: [],
      });

      await expect(
        resolver.updateTransaction(
          { id: 'tx-1', description: 'Test' } as any,
          mockUser as any,
        ),
      ).rejects.toThrow('Transaction does not belong to user');
    });

    it('should auto-complete when date changes to past', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.PLANNED,
        date: new Date(),
        installments: [],
      });
      transactionService.update.mockResolvedValue({
        id: 'tx-1',
        status: TransactionStatus.COMPLETED,
      });

      await resolver.updateTransaction(
        { id: 'tx-1', date: pastDate } as any,
        mockUser as any,
      );

      expect(transactionService.update).toHaveBeenCalledWith(
        'tx-1',
        expect.objectContaining({
          status: TransactionStatus.COMPLETED,
        }),
      );
    });

    it('should switch to PLANNED when date changes to future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.COMPLETED,
        date: new Date(),
        installments: [],
      });
      transactionService.update.mockResolvedValue({
        id: 'tx-1',
        status: TransactionStatus.PLANNED,
      });

      await resolver.updateTransaction(
        { id: 'tx-1', date: futureDate } as any,
        mockUser as any,
      );

      expect(transactionService.update).toHaveBeenCalledWith(
        'tx-1',
        expect.objectContaining({
          status: TransactionStatus.PLANNED,
        }),
      );
    });
  });

  describe('cancelTransaction', () => {
    it('should throw when transaction is already cancelled', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.CANCELED,
      });

      await expect(
        resolver.cancelTransaction(mockUser as any, 'tx-1'),
      ).rejects.toThrow('Transação já está cancelada');
    });

    it('should throw when transaction not found', async () => {
      prismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(
        resolver.cancelTransaction(mockUser as any, 'nonexistent'),
      ).rejects.toThrow('Transação não encontrada');
    });

    it('should throw when transaction belongs to another user', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'other-user',
        status: TransactionStatus.COMPLETED,
      });

      await expect(
        resolver.cancelTransaction(mockUser as any, 'tx-1'),
      ).rejects.toThrow('Transação não pertence ao usuário');
    });

    it('should reject cancellation when direct billing is PAID', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.COMPLETED,
        cardBilling: { status: CardBillingStatus.PAID },
        cardBillingId: 'billing-1',
      });

      // No installments
      prismaService.transactionInstallment = {
        findMany: vi.fn().mockResolvedValue([]),
      };

      await expect(
        resolver.cancelTransaction(mockUser as any, 'tx-1'),
      ).rejects.toThrow(
        'Não é possível cancelar transação de fatura fechada ou paga',
      );
    });

    it('should successfully cancel a simple transaction', async () => {
      prismaService.transaction.findUnique
        .mockResolvedValueOnce({
          id: 'tx-1',
          userId: 'user-1',
          status: TransactionStatus.COMPLETED,
          cardBilling: null,
          cardBillingId: null,
        })
        .mockResolvedValueOnce({
          id: 'tx-1',
          status: TransactionStatus.CANCELED,
        });

      prismaService.transactionInstallment = {
        findMany: vi.fn().mockResolvedValue([]),
      };

      transactionService.update.mockResolvedValue({
        id: 'tx-1',
        status: TransactionStatus.CANCELED,
      });

      const result = await resolver.cancelTransaction(mockUser as any, 'tx-1');

      expect(transactionService.update).toHaveBeenCalledWith('tx-1', {
        status: TransactionStatus.CANCELED,
      });
    });
  });

  describe('rescheduleTransaction', () => {
    it('should only allow rescheduling PLANNED transactions', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.COMPLETED,
      });

      await expect(
        resolver.rescheduleTransaction(
          mockUser as any,
          {
            id: 'tx-1',
            newDate: new Date(),
          } as any,
        ),
      ).rejects.toThrow('Apenas transações planejadas podem ser reagendadas');
    });

    it('should throw when transaction not found', async () => {
      prismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(
        resolver.rescheduleTransaction(
          mockUser as any,
          {
            id: 'nonexistent',
            newDate: new Date(),
          } as any,
        ),
      ).rejects.toThrow('Transação não encontrada');
    });

    it('should throw when transaction belongs to another user', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'other-user',
        status: TransactionStatus.PLANNED,
      });

      await expect(
        resolver.rescheduleTransaction(
          mockUser as any,
          {
            id: 'tx-1',
            newDate: new Date(),
          } as any,
        ),
      ).rejects.toThrow('Transação não pertence ao usuário');
    });

    it('should successfully reschedule a PLANNED transaction', async () => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 5);

      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        status: TransactionStatus.PLANNED,
      });
      transactionService.update.mockResolvedValue({
        id: 'tx-1',
        date: newDate,
      });

      const result = await resolver.rescheduleTransaction(
        mockUser as any,
        {
          id: 'tx-1',
          newDate,
        } as any,
      );

      expect(transactionService.update).toHaveBeenCalledWith('tx-1', {
        date: newDate,
      });
    });
  });

  describe('updateRecurringTransactions', () => {
    it('should throw for non-recurring transactions regardless of scope', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        recurringTransactionId: null,
      });

      await expect(
        resolver.updateRecurringTransactions(
          mockUser as any,
          {
            transactionId: 'tx-1',
            scope: 'THIS_ONLY',
            description: 'Updated',
          } as any,
        ),
      ).rejects.toThrow('Transação não faz parte de uma recorrência');
    });

    it('should throw when transaction not found', async () => {
      prismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(
        resolver.updateRecurringTransactions(
          mockUser as any,
          {
            transactionId: 'nonexistent',
            scope: 'THIS_ONLY',
            description: 'test',
          } as any,
        ),
      ).rejects.toThrow('Transação não encontrada');
    });

    it('should throw when transaction belongs to another user', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'other-user',
        recurringTransactionId: 'rec-1',
      });

      await expect(
        resolver.updateRecurringTransactions(
          mockUser as any,
          {
            transactionId: 'tx-1',
            scope: 'THIS_ONLY',
            description: 'test',
          } as any,
        ),
      ).rejects.toThrow('Transação não pertence ao usuário');
    });

    it('should update single transaction for THIS_ONLY scope', async () => {
      prismaService.transaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        userId: 'user-1',
        recurringTransactionId: 'rec-1',
      });
      transactionService.update.mockResolvedValue({
        id: 'tx-1',
        description: 'Updated',
      });

      const result = await resolver.updateRecurringTransactions(
        mockUser as any,
        {
          transactionId: 'tx-1',
          scope: 'THIS_ONLY',
          description: 'Updated',
        } as any,
      );

      expect(transactionService.update).toHaveBeenCalledWith('tx-1', {
        description: 'Updated',
      });
    });
  });
});
