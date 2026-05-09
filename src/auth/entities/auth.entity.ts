import { BaseEntity } from 'src/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { Course } from 'src/courses/entities/course.entity';

import { user_role } from './role.enum';

@Entity('users')
export class User extends BaseEntity {
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
}
