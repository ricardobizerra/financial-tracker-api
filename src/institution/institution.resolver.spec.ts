import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionResolver } from './institution.resolver';
import { InstitutionService } from './institution.service';

describe('InstitutionResolver', () => {
  let resolver: InstitutionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionResolver,
        { provide: InstitutionService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<InstitutionResolver>(InstitutionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
