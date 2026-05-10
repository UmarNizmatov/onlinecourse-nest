import { BaseEntity } from 'src/base.entity';
import { Course } from 'src/courses/entities/course.entity';

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { Assignment } from 'src/assigment/entities/assigment.entity';

@Entity('modules')
export class Module extends BaseEntity {
  @Column()
  title!: string;

  @ManyToOne(() => Course, (course) => course.modules)
  course!: Course;
  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons!: Lesson[];
  @OneToMany(() => Assignment, (assignment) => assignment.module)
  assignments!: Assignment[];
  
}
