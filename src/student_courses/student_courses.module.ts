import { Module } from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { StudentCoursesController } from './student_courses.controller';

@Module({
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
})
export class StudentCoursesModule {}
