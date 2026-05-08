import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar' })
  teacher!: string;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.beginner })
  level!: CourseLevel;
}
