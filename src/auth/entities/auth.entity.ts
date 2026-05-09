import { BaseEntity } from 'src/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { Course } from 'src/courses/entities/course.entity';

import { user_role } from './role.enum';
import { Enrollment } from 'src/student_courses/entities/enrollment.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Result } from 'src/result/entities/result.entity';

@Entity('users')
export class Auth extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({
    type: 'enum',
    enum: user_role,
    default: user_role.student,
  })
  role!: user_role;

  @OneToMany(() => Course, (course) => course.teacher)
  courses!: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments!: Enrollment[];

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions!: Submission[];
  @OneToMany(() => Result, (result) => result.user)
  results!: Result[];
}
