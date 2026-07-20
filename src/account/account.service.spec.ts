import { TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { createTestModel } from '@/utils/create-test-model';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await createTestModel({
      providers: [AccountService],
    });

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
