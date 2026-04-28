import { CardService } from './card.service';
import { NotFoundException } from '@nestjs/common';
import {
  CardBillingStatus,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('CardService', () => {
  let service: CardService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      card: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      cardBilling: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      cardBillingHistory: {
        create: vi.fn(),
      },
      transaction: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      transactionInstallment: {
        updateMany: vi.fn(),
        findFirst: vi.fn(),
      },
      $transaction: vi.fn((fn: any) => fn(mockPrisma)),
    };

    service = new CardService(mockPrisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should find a card by id', async () => {
      mockPrisma.card.findUnique.mockResolvedValue({
        id: 'card-1',
        name: 'My Card',
      });

      const result = await service.find({ id: 'card-1' });
      expect(result?.id).toBe('card-1');
    });

    it('should return null when card not found', async () => {
      mockPrisma.card.findUnique.mockResolvedValue(null);

      const result = await service.find({ id: 'nonexistent' });
      expect(result).toBeNull();
    });
  });

  describe('syncParentTransactionBillingFromFirstInstallment', () => {
    it('should sync parent billing from installment #1', async () => {
      mockPrisma.transactionInstallment.findFirst.mockResolvedValue({
        cardBillingId: 'billing-1',
      });
      mockPrisma.transaction.update.mockResolvedValue({});

      const result =
        await service.syncParentTransactionBillingFromFirstInstallment(
          'tx-parent',
        );

      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-parent' },
        data: { cardBillingId: 'billing-1' },
      });
      expect(result).toBe('billing-1');
    });

    it('should return null when installment #1 does not exist', async () => {
      mockPrisma.transactionInstallment.findFirst.mockResolvedValue(null);

      const result =
        await service.syncParentTransactionBillingFromFirstInstallment(
          'tx-parent',
        );

      expect(mockPrisma.transaction.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a card', async () => {
      const data = { name: 'New Card', type: 'CREDIT' };
      mockPrisma.card.create.mockResolvedValue({ id: 'card-1', ...data });

      const result = await service.create(data as any);
      expect(result.id).toBe('card-1');
      expect(mockPrisma.card.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('updateCard', () => {
    it('should throw when card not found', async () => {
      mockPrisma.card.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCard({
          cardId: 'nonexistent',
          userId: 'user-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only provided fields', async () => {
      mockPrisma.card.findFirst.mockResolvedValue({ id: 'card-1' });
      mockPrisma.card.update.mockResolvedValue({
        id: 'card-1',
        billingCycleDay: 20,
      });

      await service.updateCard({
        cardId: 'card-1',
        userId: 'user-1',
        billingCycleDay: 20,
      });

      expect(mockPrisma.card.update).toHaveBeenCalledWith({
        where: { id: 'card-1' },
        data: { billingCycleDay: 20 },
      });
    });
  });

  describe('createBilling', () => {
    it('should calculate period for date BEFORE cycle day (belongs to current cycle)', async () => {
      // Cycle day = 15, date = Jan 10 → period: Dec 16 → Jan 15
      const periodStart = new Date(2026, 0, 10); // Jan 10
      const cycleDay = 15;
      const paymentDay = 25;

      mockPrisma.cardBilling.create.mockImplementation(({ data }: any) => ({
        id: 'billing-1',
        ...data,
        card: {
          institutionLink: { institution: {}, user: {} },
        },
      }));
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.createBilling({
        cardId: 'card-1',
        cardBillingCycleDay: cycleDay,
        cardBillingPaymentDay: paymentDay,
        periodStart,
        limit: new Decimal(5000),
      });

      // periodStart should be Dec 16 (previous month, cycleDay + 1)
      expect(result.periodStart.getMonth()).toBe(11); // December
      expect(result.periodStart.getDate()).toBe(16);

      // periodEnd should be Jan 15
      expect(result.periodEnd.getMonth()).toBe(0); // January
      expect(result.periodEnd.getDate()).toBe(15);
    });

    it('should calculate period for date ON cycle day (belongs to next cycle)', async () => {
      // Cycle day = 15, date = Jan 15 → should go to next cycle
      // Period: Jan 16 → Feb 15
      const periodStart = new Date(2026, 0, 15); // Jan 15
      const cycleDay = 15;
      const paymentDay = 25;

      mockPrisma.cardBilling.create.mockImplementation(({ data }: any) => ({
        id: 'billing-1',
        ...data,
        card: {
          institutionLink: { institution: {}, user: {} },
        },
      }));
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.createBilling({
        cardId: 'card-1',
        cardBillingCycleDay: cycleDay,
        cardBillingPaymentDay: paymentDay,
        periodStart,
        limit: new Decimal(5000),
      });

      // Date ON cycle day → next cycle
      // periodStart should be Jan 16 (cycleDay + 1)
      expect(result.periodStart.getMonth()).toBe(0); // January
      expect(result.periodStart.getDate()).toBe(16);

      // periodEnd should be Feb 15
      expect(result.periodEnd.getMonth()).toBe(1); // February
      expect(result.periodEnd.getDate()).toBe(15);
    });

    it('should calculate period for date AFTER cycle day (belongs to next cycle)', async () => {
      // Cycle day = 15, date = Jan 20 → period: Jan 16 → Feb 15
      const periodStart = new Date(2026, 0, 20); // Jan 20
      const cycleDay = 15;
      const paymentDay = 25;

      mockPrisma.cardBilling.create.mockImplementation(({ data }: any) => ({
        id: 'billing-1',
        ...data,
        card: {
          institutionLink: { institution: {}, user: {} },
        },
      }));
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.createBilling({
        cardId: 'card-1',
        cardBillingCycleDay: cycleDay,
        cardBillingPaymentDay: paymentDay,
        periodStart,
        limit: new Decimal(5000),
      });

      // periodStart should be Jan 16
      expect(result.periodStart.getMonth()).toBe(0); // January
      expect(result.periodStart.getDate()).toBe(16);

      // periodEnd should be Feb 15
      expect(result.periodEnd.getMonth()).toBe(1); // February
      expect(result.periodEnd.getDate()).toBe(15);
    });

    it('should calculate payment date after cycle day in same month', async () => {
      // Cycle day = 10, payment day = 20 → payment in same month as periodEnd
      const periodStart = new Date(2026, 0, 5); // Jan 5
      const cycleDay = 10;
      const paymentDay = 20; // > cycleDay → same month

      mockPrisma.cardBilling.create.mockImplementation(({ data }: any) => ({
        id: 'billing-1',
        ...data,
        card: {
          institutionLink: { institution: {}, user: {} },
        },
      }));
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.createBilling({
        cardId: 'card-1',
        cardBillingCycleDay: cycleDay,
        cardBillingPaymentDay: paymentDay,
        periodStart,
        limit: new Decimal(5000),
      });

      // paymentDay > cycleDay → same month as periodEnd
      expect(result.paymentDate.getDate()).toBe(20);
    });

    it('should calculate payment date in next month when paymentDay <= cycleDay', async () => {
      // Cycle day = 15, payment day = 5 → payment in next month
      const periodStart = new Date(2026, 0, 10); // Jan 10
      const cycleDay = 15;
      const paymentDay = 5; // <= cycleDay → next month

      mockPrisma.cardBilling.create.mockImplementation(({ data }: any) => ({
        id: 'billing-1',
        ...data,
        card: {
          institutionLink: { institution: {}, user: {} },
        },
      }));
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.createBilling({
        cardId: 'card-1',
        cardBillingCycleDay: cycleDay,
        cardBillingPaymentDay: paymentDay,
        periodStart,
        limit: new Decimal(5000),
      });

      // paymentDay <= cycleDay → month after periodEnd
      expect(result.paymentDate.getDate()).toBe(5);
      // periodEnd is Jan → payment should be Feb
      expect(result.paymentDate.getMonth()).toBe(1); // February
    });

    it('should create billing history with PENDING status', async () => {
      const periodStart = new Date(2026, 0, 10);

      mockPrisma.cardBilling.create.mockResolvedValue({
        id: 'billing-1',
        card: {
          institutionLink: { institution: {}, user: {} },
        },
      });
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      await service.createBilling({
        cardId: 'card-1',
        cardBillingCycleDay: 15,
        cardBillingPaymentDay: 25,
        periodStart,
        limit: new Decimal(5000),
      });

      expect(mockPrisma.cardBillingHistory.create).toHaveBeenCalledWith({
        data: {
          cardBilling: { connect: { id: 'billing-1' } },
          status: CardBillingStatus.PENDING,
        },
      });
    });
  });

  describe('updatePaymentTransaction', () => {
    it('should throw when billing not found', async () => {
      mockPrisma.cardBilling.findUnique.mockResolvedValue(null);

      await expect(
        service.updatePaymentTransaction('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create payment transaction when totalAmount > 0 and no existing payment', async () => {
      mockPrisma.cardBilling.findUnique.mockResolvedValue({
        id: 'billing-1',
        paymentDate: new Date(),
        periodStart: new Date(),
        transactions: [
          { amount: new Decimal(100), status: TransactionStatus.COMPLETED },
        ],
        installments: [],
        card: {
          name: 'My Card',
          institutionLink: {
            institution: {},
            user: { id: 'user-1' },
          },
        },
      });
      mockPrisma.transaction.findFirst.mockResolvedValue(null);
      mockPrisma.transaction.create.mockResolvedValue({ id: 'payment-1' });

      const result = await service.updatePaymentTransaction('billing-1');

      expect(mockPrisma.transaction.create).toHaveBeenCalled();
      expect(result?.id).toBe('payment-1');
    });

    it('should update existing payment when totalAmount > 0', async () => {
      mockPrisma.cardBilling.findUnique.mockResolvedValue({
        id: 'billing-1',
        paymentDate: new Date(),
        periodStart: new Date(),
        transactions: [
          { amount: new Decimal(200), status: TransactionStatus.COMPLETED },
        ],
        installments: [],
        card: {
          name: 'My Card',
          institutionLink: {
            institution: {},
            user: { id: 'user-1' },
          },
        },
      });
      mockPrisma.transaction.findFirst.mockResolvedValue({
        id: 'payment-1',
        amount: new Decimal(100),
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'payment-1',
        amount: new Decimal(200),
      });

      const result = await service.updatePaymentTransaction('billing-1');

      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { amount: expect.any(Decimal) },
      });
    });

    it('should delete payment and check billing deletion when totalAmount = 0', async () => {
      mockPrisma.cardBilling.findUnique.mockResolvedValue({
        id: 'billing-1',
        paymentDate: new Date(),
        periodStart: new Date(),
        transactions: [],
        installments: [],
        card: {
          id: 'card-1',
          name: 'My Card',
          institutionLink: {
            institution: {},
            user: { id: 'user-1' },
          },
        },
      });
      mockPrisma.transaction.findFirst.mockResolvedValue({
        id: 'payment-1',
      });
      mockPrisma.transaction.update.mockResolvedValue({});
      mockPrisma.transaction.delete.mockResolvedValue({});
      mockPrisma.cardBilling.findFirst.mockResolvedValue({
        id: 'other-billing',
      });
      mockPrisma.transaction.count.mockResolvedValue(0);
      mockPrisma.cardBilling.delete.mockResolvedValue({});

      const result = await service.updatePaymentTransaction('billing-1');

      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { billingPayment: { disconnect: true } },
      });
      expect(mockPrisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
      });
      expect(result).toBeNull();
    });
  });

  describe('closeBilling', () => {
    it('should throw when billing not found', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue(null);

      await expect(
        service.closeBilling({
          billingId: 'nonexistent',
          userId: 'user-1',
        }),
      ).rejects.toThrow('Billing not found or already closed');
    });

    it('should create next billing and close current', async () => {
      const billing = {
        id: 'billing-1',
        cardId: 'card-1',
        card: {
          billingCycleDay: 15,
          billingPaymentDay: 25,
          defaultLimit: new Decimal(5000),
          institutionLink: {},
        },
        paymentTransaction: null,
        transactions: [
          {
            id: 'tx-1',
            date: new Date(2026, 0, 5),
            amount: new Decimal(100),
          },
        ],
        installments: [],
      };

      mockPrisma.cardBilling.findFirst.mockResolvedValue(billing);

      // createBilling mocks
      mockPrisma.cardBilling.create.mockResolvedValue({
        id: 'next-billing',
        card: { institutionLink: { institution: {}, user: {} } },
      });
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      // updatePaymentTransaction mocks
      mockPrisma.cardBilling.findUnique.mockResolvedValue({
        id: 'billing-1',
        transactions: billing.transactions,
        installments: [],
        paymentDate: new Date(),
        periodStart: new Date(),
        card: {
          name: 'Card',
          institutionLink: { institution: {}, user: { id: 'user-1' } },
        },
      });
      mockPrisma.transaction.findFirst.mockResolvedValue(null);
      mockPrisma.transaction.create.mockResolvedValue({
        id: 'payment-tx',
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'payment-tx',
      });
      mockPrisma.cardBilling.update.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.CLOSED,
      });

      const result = await service.closeBilling({
        billingId: 'billing-1',
        userId: 'user-1',
      });

      expect(result.status).toBe(CardBillingStatus.CLOSED);
    });

    it('should resync parent transaction billing when installments are moved', async () => {
      const billing = {
        id: 'billing-1',
        cardId: 'card-1',
        card: {
          billingCycleDay: 15,
          billingPaymentDay: 25,
          defaultLimit: new Decimal(5000),
          institutionLink: {},
        },
        paymentTransaction: null,
        transactions: [],
        installments: [
          {
            id: 'inst-1',
            transactionId: 'tx-parent',
            transaction: {
              id: 'tx-parent',
              date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          },
        ],
      };

      mockPrisma.cardBilling.findFirst.mockResolvedValue(billing);
      mockPrisma.cardBilling.create.mockResolvedValue({
        id: 'next-billing',
        card: { institutionLink: { institution: {}, user: {} } },
      });
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});
      mockPrisma.transactionInstallment.updateMany.mockResolvedValue({
        count: 1,
      });
      mockPrisma.transactionInstallment.findFirst.mockResolvedValue({
        cardBillingId: 'next-billing',
      });
      mockPrisma.transaction.update.mockResolvedValue({});
      mockPrisma.cardBilling.findUnique.mockResolvedValue({
        id: 'billing-1',
        transactions: [],
        installments: [],
        paymentDate: new Date(),
        periodStart: new Date(),
        card: {
          id: 'card-1',
          name: 'Card',
          institutionLink: { institution: {}, user: { id: 'user-1' } },
        },
      });
      mockPrisma.transaction.findFirst.mockResolvedValue(null);
      mockPrisma.cardBilling.update.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.CLOSED,
      });

      await service.closeBilling({
        billingId: 'billing-1',
        userId: 'user-1',
      });

      expect(mockPrisma.transactionInstallment.updateMany).toHaveBeenCalled();
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-parent' },
        data: { cardBillingId: 'next-billing' },
      });
    });
  });

  describe('payBilling', () => {
    it('should throw when billing not found', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue(null);

      await expect(
        service.payBilling({
          billingId: 'nonexistent',
          userId: 'user-1',
          sourceAccountId: 'acc-1',
        }),
      ).rejects.toThrow('Billing not found');
    });

    it('should reject PENDING billing', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.PENDING,
        paymentTransaction: { id: 'payment-1' },
      });

      await expect(
        service.payBilling({
          billingId: 'billing-1',
          userId: 'user-1',
          sourceAccountId: 'acc-1',
        }),
      ).rejects.toThrow(
        'Não é possível pagar uma fatura que ainda não foi fechada',
      );
    });

    it('should reject already PAID billing', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.PAID,
        paymentTransaction: { id: 'payment-1' },
      });

      await expect(
        service.payBilling({
          billingId: 'billing-1',
          userId: 'user-1',
          sourceAccountId: 'acc-1',
        }),
      ).rejects.toThrow('Esta fatura já foi paga');
    });

    it('should throw when no payment transaction exists', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.CLOSED,
        paymentTransaction: null,
      });

      await expect(
        service.payBilling({
          billingId: 'billing-1',
          userId: 'user-1',
          sourceAccountId: 'acc-1',
        }),
      ).rejects.toThrow('Payment transaction not found for this billing');
    });

    it('should pay a CLOSED billing and mark as PAID', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.CLOSED,
        paymentTransaction: { id: 'payment-1' },
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'payment-1',
        status: TransactionStatus.COMPLETED,
      });
      mockPrisma.cardBilling.update.mockResolvedValue({});
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.payBilling({
        billingId: 'billing-1',
        userId: 'user-1',
        sourceAccountId: 'acc-1',
      });

      expect(result.status).toBe(TransactionStatus.COMPLETED);
      expect(mockPrisma.cardBilling.update).toHaveBeenCalledWith({
        where: { id: 'billing-1' },
        data: { status: CardBillingStatus.PAID },
      });
    });

    it('should pay an OVERDUE billing and mark as PAID', async () => {
      mockPrisma.cardBilling.findFirst.mockResolvedValue({
        id: 'billing-1',
        status: CardBillingStatus.OVERDUE,
        paymentTransaction: { id: 'payment-1' },
      });
      mockPrisma.transaction.update.mockResolvedValue({
        id: 'payment-1',
        status: TransactionStatus.COMPLETED,
      });
      mockPrisma.cardBilling.update.mockResolvedValue({});
      mockPrisma.cardBillingHistory.create.mockResolvedValue({});

      const result = await service.payBilling({
        billingId: 'billing-1',
        userId: 'user-1',
        sourceAccountId: 'acc-1',
      });

      expect(result.status).toBe(TransactionStatus.COMPLETED);
      expect(mockPrisma.cardBilling.update).toHaveBeenCalledWith({
        where: { id: 'billing-1' },
        data: { status: CardBillingStatus.PAID },
      });
    });
  });

  describe('checkBillingStatuses (cron)', () => {
    it('should mark CLOSED/OVERDUE billings with COMPLETED payment as PAID', async () => {
      mockPrisma.cardBilling.findMany
        .mockResolvedValueOnce([
          // billingsToPay
          {
            id: 'billing-1',
            paymentTransaction: {
              status: TransactionStatus.COMPLETED,
            },
          },
        ])
        .mockResolvedValueOnce([]); // overdueBillings

      mockPrisma.$transaction.mockResolvedValue([]);

      await service.checkBillingStatuses();

      expect(mockPrisma.cardBilling.findMany).toHaveBeenCalledTimes(2);
    });

    it('should mark CLOSED billings with past paymentDate as OVERDUE', async () => {
      mockPrisma.cardBilling.findMany
        .mockResolvedValueOnce([]) // billingsToPay
        .mockResolvedValueOnce([
          // overdueBillings
          {
            id: 'billing-1',
          },
        ]);

      mockPrisma.$transaction.mockResolvedValue([]);

      await service.checkBillingStatuses();

      expect(mockPrisma.cardBilling.findMany).toHaveBeenCalledTimes(2);
    });
  });
});
