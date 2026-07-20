import { TestingModule } from '@nestjs/testing';
import { UserResolver } from '@/user/user.resolver';
import { UserService } from '@/user/user.service';
import { AuthService } from '@/auth/auth.service';
import { createTestModel } from '@/utils/create-test-model';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await createTestModel({
      providers: [
        UserResolver,
        { provide: UserService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    });

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
