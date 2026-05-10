import { Module } from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { StudentCoursesController } from './student_courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Auth, Course])],
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
})
export class StudentCoursesModule {}
