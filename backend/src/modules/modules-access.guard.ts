import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/student_courses/entities/enrollment.entity';
import { user_role } from 'src/auth/entities/role.enum';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class ModulesAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Module) private readonly moduleRepo: Repository<Module>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Auth;
    const moduleId = request.params.moduleId ?? request.params.id;
    const courseId = request.body?.courseId;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (moduleId) {
      const module = await this.moduleRepo.findOne({
        where: { id: moduleId },
        relations: ['course', 'course.teacher'],
      });

      if (!module) {
        throw new NotFoundException(`Module #${moduleId} not found`);
      }

      if (user.role === user_role.admin) {
        return true;
      }

      if (user.role === user_role.teacher) {
        if (module.course.teacher?.id === user.id) {
          return true;
        }
        throw new ForbiddenException('Teacher is not assigned to this course');
      }

      const enrollment = await this.enrollmentRepo.findOne({
        where: {
          user: { id: user.id },
          course: { id: module.course.id },
        },
      });

      if (!enrollment) {
        throw new ForbiddenException(
          'Access denied: user is not enrolled in this course',
        );
      }

      return true;
    }

    if (courseId) {
      const course = await this.courseRepo.findOne({
        where: { id: courseId },
        relations: ['teacher'],
      });

      if (!course) {
        throw new NotFoundException(`Course #${courseId} not found`);
      }

      if (user.role === user_role.admin) {
        return true;
      }

      if (user.role === user_role.teacher) {
        if (course.teacher?.id === user.id) {
          return true;
        }
        throw new ForbiddenException('Teacher is not assigned to this course');
      }

      throw new ForbiddenException(
        'Access denied: only admin or teacher can create module for this course',
      );
    }

    throw new ForbiddenException('Module id or course id is required');
  }
}
