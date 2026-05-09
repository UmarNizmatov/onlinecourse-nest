import { Test, TestingModule } from '@nestjs/testing';
import { AssigmentService } from './assigment.service';

describe('AssigmentService', () => {
  let service: AssigmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssigmentService],
    }).compile();

    service = module.get<AssigmentService>(AssigmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
