import { TransactionService } from './transaction.service';
import { TransactionStatus, CardBillingStatus } from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      transaction: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        updateMany: vi.fn(),
        count: vi.fn(),
        groupBy: vi.fn(),
      },
    };

    service = new TransactionService(mockPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeCancelInfo', () => {
    it('should return canCancel: false for already cancelled transactions', () => {
      const result = service.computeCancelInfo(
        { id: '1', status: TransactionStatus.CANCELED },
        [],
      );

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe('Transação já cancelada');
      expect(result.warningMessage).toBeNull();
    });

    it('should return canCancel: false when first installment is in a PAID billing', () => {
      const result = service.computeCancelInfo(
        { id: '1', status: TransactionStatus.COMPLETED },
        [
          {
            installmentNumber: 1,
            cardBilling: { status: CardBillingStatus.PAID },
          },
          {
            installmentNumber: 2,
            cardBilling: { status: CardBillingStatus.PENDING },
          },
        ],
      );

      expect(result.canCancel).toBe(false);
      expect(result.reason).toContain('fatura fechada ou paga');
    });

    it('should return canCancel: false when first installment is in a CLOSED billing', () => {
      const result = service.computeCancelInfo(
        { id: '1', status: TransactionStatus.COMPLETED },
        [
          {
            installmentNumber: 1,
            cardBilling: { status: CardBillingStatus.CLOSED },
          },
        ],
      );

      expect(result.canCancel).toBe(false);
    });

    it('should return canCancel: false when first installment is in a COMPLETED billing', () => {
      const result = service.computeCancelInfo(
        { id: '1', status: TransactionStatus.COMPLETED },
        [
          {
            installmentNumber: 1,
            cardBilling: { status: CardBillingStatus.COMPLETED },
          },
        ],
      );

      expect(result.canCancel).toBe(false);
    });

    it('should return canCancel: true with warning for installments in PENDING billing', () => {
      const result = service.computeCancelInfo(
        { id: '1', status: TransactionStatus.COMPLETED },
        [
          {
            installmentNumber: 1,
            cardBilling: { status: CardBillingStatus.PENDING },
          },
          {
            installmentNumber: 2,
            cardBilling: { status: CardBillingStatus.PENDING },
          },
          {
            installmentNumber: 3,
            cardBilling: { status: CardBillingStatus.PENDING },
          },
        ],
      );

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBeNull();
      expect(result.warningMessage).toContain('3 parcelas');
    });

    it('should return canCancel: false when direct cardBilling is PAID', () => {
      const result = service.computeCancelInfo(
        {
          id: '1',
          status: TransactionStatus.COMPLETED,
          cardBilling: { status: CardBillingStatus.PAID },
        },
        [],
      );

      expect(result.canCancel).toBe(false);
      expect(result.reason).toContain('fatura fechada ou paga');
    });

    it('should return canCancel: false when direct cardBilling is CLOSED', () => {
      const result = service.computeCancelInfo(
        {
          id: '1',
          status: TransactionStatus.COMPLETED,
          cardBilling: { status: CardBillingStatus.CLOSED },
        },
        [],
      );

      expect(result.canCancel).toBe(false);
    });

    it('should return canCancel: true when no billing and no installments', () => {
      const result = service.computeCancelInfo(
        { id: '1', status: TransactionStatus.COMPLETED },
        [],
      );

      expect(result.canCancel).toBe(true);
      expect(result.reason).toBeNull();
      expect(result.warningMessage).toBeNull();
    });

    it('should return canCancel: true when direct cardBilling is PENDING', () => {
      const result = service.computeCancelInfo(
        {
          id: '1',
          status: TransactionStatus.COMPLETED,
          cardBilling: { status: CardBillingStatus.PENDING },
        },
        [],
      );

      expect(result.canCancel).toBe(true);
    });
  });

  describe('getSummary', () => {
    it('should calculate realized and forecast balances correctly', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          type: 'INCOME',
          status: TransactionStatus.COMPLETED,
          _sum: { amount: 1000 },
          _count: { id: 2 },
        },
        {
          type: 'EXPENSE',
          status: TransactionStatus.COMPLETED,
          _sum: { amount: 300 },
          _count: { id: 1 },
        },
        {
          type: 'INCOME',
          status: TransactionStatus.PLANNED,
          _sum: { amount: 500 },
          _count: { id: 1 },
        },
        {
          type: 'EXPENSE',
          status: TransactionStatus.PLANNED,
          _sum: { amount: 200 },
          _count: { id: 1 },
        },
        {
          type: 'EXPENSE',
          status: TransactionStatus.CANCELED,
          _sum: { amount: 100 },
          _count: { id: 1 },
        },
      ]);

      const result = await service.getSummary({
        userId: 'user-1',
        filterArgs: {},
        searchArgs: {},
      } as any);

      // Realized = only COMPLETED
      expect(result.realizedIncome).toBe(1000);
      expect(result.realizedExpense).toBe(300);
      expect(result.realizedBalance).toBe(700);

      // Forecast = COMPLETED + PLANNED + OVERDUE (not CANCELED)
      expect(result.forecastIncome).toBe(1500); // 1000 + 500
      expect(result.forecastExpense).toBe(500); // 300 + 200
      expect(result.forecastBalance).toBe(1000); // 1500 - 500

      expect(result.transactionCount).toBe(6); // all including canceled
    });

    it('should return all zeros for empty results', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([]);

      const result = await service.getSummary({
        userId: 'user-1',
        filterArgs: {},
        searchArgs: {},
      } as any);

      expect(result.realizedIncome).toBe(0);
      expect(result.realizedExpense).toBe(0);
      expect(result.realizedBalance).toBe(0);
      expect(result.forecastIncome).toBe(0);
      expect(result.forecastExpense).toBe(0);
      expect(result.forecastBalance).toBe(0);
      expect(result.transactionCount).toBe(0);
    });

    it('should include OVERDUE transactions in forecast', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          type: 'EXPENSE',
          status: TransactionStatus.OVERDUE,
          _sum: { amount: 400 },
          _count: { id: 2 },
        },
      ]);

      const result = await service.getSummary({
        userId: 'user-1',
        filterArgs: {},
        searchArgs: {},
      } as any);

      expect(result.forecastExpense).toBe(400);
      expect(result.realizedExpense).toBe(0); // OVERDUE is not realized
    });
  });

  describe('updateTransactionStatuses (cron)', () => {
    it('should mark past PLANNED transactions as OVERDUE', async () => {
      mockPrismaService.transaction.updateMany.mockResolvedValue({ count: 3 });

      await service.updateTransactionStatuses();

      expect(mockPrismaService.transaction.updateMany).toHaveBeenCalledWith({
        where: {
          status: TransactionStatus.PLANNED,
          date: { lt: expect.any(Date) },
        },
        data: {
          status: TransactionStatus.OVERDUE,
        },
      });
    });

    it('should not log when no transactions are updated', async () => {
      mockPrismaService.transaction.updateMany.mockResolvedValue({ count: 0 });

      await service.updateTransactionStatuses();

      expect(mockPrismaService.transaction.updateMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a transaction via prisma', async () => {
      const data = { description: 'Test', amount: 100 };
      mockPrismaService.transaction.create.mockResolvedValue({
        id: '1',
        ...data,
      });

      const result = await service.create(data as any);

      expect(result.id).toBe('1');
      expect(mockPrismaService.transaction.create).toHaveBeenCalledWith({
        data,
      });
    });
  });

  describe('update', () => {
    it('should update a transaction via prisma', async () => {
      mockPrismaService.transaction.update.mockResolvedValue({
        id: '1',
        description: 'Updated',
      });

      const result = await service.update('1', { description: 'Updated' });

      expect(result.description).toBe('Updated');
      expect(mockPrismaService.transaction.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { description: 'Updated' },
      });
    });
  });

  describe('find', () => {
    it('should find a transaction by id', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue({
        id: '1',
        description: 'Test',
      });

      const result = await service.find({ id: '1' });

      expect(result?.id).toBe('1');
    });

    it('should return null when not found', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      const result = await service.find({ id: 'nonexistent' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      mockPrismaService.transaction.delete.mockResolvedValue({ id: '1' });

      const result = await service.delete('1');

      expect(result.id).toBe('1');
      expect(mockPrismaService.transaction.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
