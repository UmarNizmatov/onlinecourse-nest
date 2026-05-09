import { BaseEntity } from 'src/base.entity';
import { Module } from 'src/modules/entities/module.entity';

import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('lessons')
export class Lesson extends BaseEntity {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column({ type: 'varchar', nullable: true })
  videoUrl!: string;

  @ManyToOne(() => Module, (module) => module.lessons, {
    onDelete: 'CASCADE',
  })
  module!: Module;
}
