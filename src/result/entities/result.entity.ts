import { BaseEntity } from 'src/base.entity';

import { Column, Entity, ManyToOne } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';

@Entity('results')
export class Result extends BaseEntity {
  @ManyToOne(() => Auth, (user) => user.results, {
    onDelete: 'CASCADE',
  })
  user!: Auth;

  @ManyToOne(() => Course, (course) => course.results, {
    onDelete: 'CASCADE',
  })
  course!: Course;

  @Column({
    type: 'int',
    default: 0,
  })
  totalScore!: number;
}
