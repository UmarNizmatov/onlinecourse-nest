import { Auth } from 'src/auth/entities/auth.entity';
import { BaseEntity } from 'src/base.entity';
import { Course } from 'src/courses/entities/course.entity';


import { Entity, ManyToOne, Unique } from 'typeorm';

@Entity('enrollments')
@Unique(['user', 'course'])
export class Enrollment extends BaseEntity {
  @ManyToOne(() => Auth, (user) => user.enrollments, {
    onDelete: 'CASCADE',
  })
  user!: Auth;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  course!: Course;
}
