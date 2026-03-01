import { CardResolver } from './card.resolver';
import { CardService } from './card.service';
import { AccountService } from '@/account/account.service';
import { CardType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('CardResolver', () => {
  let resolver: CardResolver;
  let cardService: any;
  let accountService: any;

  beforeEach(() => {
    cardService = {
      find: vi.fn(),
      findMany: vi.fn(),
      findCurrentBilling: vi.fn(),
      findBillingTransactions: vi.fn(),
      create: vi.fn(),
      createBilling: vi.fn(),
      closeBilling: vi.fn(),
      updateCard: vi.fn(),
      $transaction: vi.fn((fn: any) => fn({})),
    };

    accountService = {
      find: vi.fn(),
    };

    resolver = new CardResolver(cardService, accountService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCard', () => {
    it('should throw when credit card is missing billingCycleDay', async () => {
      await expect(
        resolver.createCard({
          name: 'Credit Card',
          type: CardType.CREDIT,
          institutionLinkId: 'link-1',
          billingPaymentDay: 25,
          defaultLimit: new Decimal(5000),
        } as any),
      ).rejects.toThrow('Billing cycle day is required for credit cards');
    });

    it('should throw when credit card is missing billingPaymentDay', async () => {
      await expect(
        resolver.createCard({
          name: 'Credit Card',
          type: CardType.CREDIT,
          institutionLinkId: 'link-1',
          billingCycleDay: 15,
          defaultLimit: new Decimal(5000),
        } as any),
      ).rejects.toThrow('Billing payment day is required for credit cards');
    });

    it('should throw when credit card is missing defaultLimit', async () => {
      await expect(
        resolver.createCard({
          name: 'Credit Card',
          type: CardType.CREDIT,
          institutionLinkId: 'link-1',
          billingCycleDay: 15,
          billingPaymentDay: 25,
        } as any),
      ).rejects.toThrow('Default limit is required for credit cards');
    });

    it('should throw with all missing fields listed', async () => {
      await expect(
        resolver.createCard({
          name: 'Credit Card',
          type: CardType.CREDIT,
          institutionLinkId: 'link-1',
        } as any),
      ).rejects.toThrow('are required for credit cards');
    });

    it('should create credit card with billing', async () => {
      const createdCard = {
        id: 'card-1',
        name: 'Credit Card',
        type: CardType.CREDIT,
        createdAt: new Date(),
        defaultLimit: new Decimal(5000),
      };

      cardService.create.mockResolvedValue(createdCard);
      cardService.createBilling.mockResolvedValue({ id: 'billing-1' });

      const result = await resolver.createCard({
        name: 'Credit Card',
        type: CardType.CREDIT,
        institutionLinkId: 'link-1',
        billingCycleDay: 15,
        billingPaymentDay: 25,
        defaultLimit: new Decimal(5000),
      } as any);

      expect(result.id).toBe('card-1');
      expect(cardService.createBilling).toHaveBeenCalled();
    });

    it('should create debit card without billing', async () => {
      const createdCard = {
        id: 'card-2',
        name: 'Debit Card',
        type: CardType.DEBIT,
      };

      cardService.create.mockResolvedValue(createdCard);

      const result = await resolver.createCard({
        name: 'Debit Card',
        type: CardType.DEBIT,
        institutionLinkId: 'link-1',
      } as any);

      expect(result.id).toBe('card-2');
      expect(cardService.createBilling).not.toHaveBeenCalled();
    });
  });

  describe('closeBilling', () => {
    it('should delegate to cardService.closeBilling', async () => {
      const mockUser = { id: 'user-1' };
      cardService.closeBilling.mockResolvedValue({
        id: 'billing-1',
        status: 'CLOSED',
      });

      const result = await resolver.closeBilling(mockUser as any, 'billing-1');

      expect(cardService.closeBilling).toHaveBeenCalledWith({
        billingId: 'billing-1',
        userId: 'user-1',
        closingDate: undefined,
      });
      expect(result.status).toBe('CLOSED');
    });
  });

  describe('updateAccountCard', () => {
    it('should delegate to cardService.updateCard', async () => {
      const mockUser = { id: 'user-1' };
      cardService.updateCard.mockResolvedValue({
        id: 'card-1',
        billingCycleDay: 20,
      });

      const result = await resolver.updateAccountCard(
        mockUser as any,
        'card-1',
        20,
      );

      expect(cardService.updateCard).toHaveBeenCalledWith(
        expect.objectContaining({
          cardId: 'card-1',
          userId: 'user-1',
          billingCycleDay: 20,
        }),
      );
    });
  });
});
