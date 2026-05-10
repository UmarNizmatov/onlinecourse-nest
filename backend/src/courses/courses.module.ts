import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { JwtAccessGuard } from 'src/auth/jwt-access.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Enrollment } from 'src/student_courses/entities/enrollment.entity';
import { CourseAccessGuard } from './course-access.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Auth, Enrollment]),
    JwtModule.register({}),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, JwtAccessGuard, RolesGuard, CourseAccessGuard],
})
export class CoursesModule {}
