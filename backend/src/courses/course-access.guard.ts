import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Enrollment } from 'src/student_courses/entities/enrollment.entity';
import { user_role } from 'src/auth/entities/role.enum';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class CourseAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Auth;
    const courseId = request.params.courseId;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === user_role.admin) {
      return true;
    }

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['teacher'],
    });

    if (!course) {
      throw new NotFoundException(`Course #${courseId} not found`);
    }

    if (user.role === user_role.teacher) {
      if (course.teacher?.id === user.id) {
        return true;
      }
      throw new ForbiddenException('Teacher is not assigned to this course');
    }

    const enrollment = await this.enrollmentRepo.findOne({
      where: {
        user: { id: user.id },
        course: { id: courseId },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        'Access denied: user is not enrolled in this course',
      );
    }

    return true;
  }
}
