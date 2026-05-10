import { Test, TestingModule } from '@nestjs/testing';
import { AssigmentController } from './assigment.controller';
import { AssigmentService } from './assigment.service';

describe('AssigmentController', () => {
  let controller: AssigmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssigmentController],
      providers: [AssigmentService],
    }).compile();

    controller = module.get<AssigmentController>(AssigmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
