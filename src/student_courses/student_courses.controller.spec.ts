import { Test, TestingModule } from '@nestjs/testing';
import { StudentCoursesController } from './student_courses.controller';
import { StudentCoursesService } from './student_courses.service';

describe('StudentCoursesController', () => {
  let controller: StudentCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentCoursesController],
      providers: [StudentCoursesService],
    }).compile();

    controller = module.get<StudentCoursesController>(StudentCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
