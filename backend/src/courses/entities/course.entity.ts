import { BaseEntity } from 'src/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Module } from 'src/modules/entities/module.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Enrollment } from 'src/student_courses/entities/enrollment.entity';
import { Result } from 'src/result/entities/result.entity';

export enum CourseLevel {
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

@Entity('courses')
export class Course extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @ManyToOne(() => Auth, (auth) => auth.courses)
  teacher!: Auth;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.beginner,
  })
  level!: CourseLevel;

  @OneToMany(() => Module, (module) => module.course)
  modules!: Module[];
  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments!: Enrollment[];
  @OneToMany(() => Result, (result) => result.course)
  results!: Result[];
}
