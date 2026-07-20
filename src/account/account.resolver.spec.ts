import { Test, TestingModule } from '@nestjs/testing';
import { AccountResolver } from './account.resolver';
import { createTestModel } from '@/utils/create-test-model';
import { AccountService } from './account.service';
import { CardService } from '@/card/card.service';

describe('AccountResolver', () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await createTestModel({
      providers: [
        AccountResolver,
        { provide: AccountService, useValue: {} },
        { provide: CardService, useValue: {} },
      ],
    });

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
