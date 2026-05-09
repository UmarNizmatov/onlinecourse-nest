
import { BaseEntity } from 'src/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Module } from 'src/modules/entities/module.entity';
import { User } from 'src/auth/entities/auth.entity';

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

  @ManyToOne(() => User, (user) => user.courses)
  teacher!: User;

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
}
