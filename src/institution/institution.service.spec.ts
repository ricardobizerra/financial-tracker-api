import { TestingModule } from '@nestjs/testing';
import { InstitutionService } from './institution.service';
import { createTestModel } from '@/utils/create-test-model';

describe('InstitutionService', () => {
  let service: InstitutionService;

  beforeEach(async () => {
    const module: TestingModule = await createTestModel({
      providers: [InstitutionService],
    });

    service = module.get<InstitutionService>(InstitutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
