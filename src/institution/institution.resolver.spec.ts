import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionResolver } from './institution.resolver';

describe('InstitutionResolver', () => {
  let resolver: InstitutionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstitutionResolver],
    }).compile();

    resolver = module.get<InstitutionResolver>(InstitutionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
