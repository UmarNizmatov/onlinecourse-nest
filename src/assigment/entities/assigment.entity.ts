import { BaseEntity } from 'src/base.entity';
import { Module } from 'src/modules/entities/module.entity';
import { Submission } from 'src/submission/entities/submission.entity';

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('assignments')
export class Assignment extends BaseEntity {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int', default: 100 })
  maxScore!: number;

  @ManyToOne(() => Module, (module) => module.assignments, {
    onDelete: 'CASCADE',
  })
  module!: Module;

  @OneToMany(() => Submission, (submission) => submission.assignment)
  submissions!: Submission[];
}
