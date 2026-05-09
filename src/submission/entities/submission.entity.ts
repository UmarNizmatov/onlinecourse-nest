import { BaseEntity } from 'src/base.entity';

import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Assignment } from 'src/assigment/entities/assigment.entity';

export enum SubmissionStatus {
  pending = 'pending',
  checked = 'checked',
}

@Entity('submissions')
export class Submission extends BaseEntity {
  @ManyToOne(() => Assignment, (assignment) => assignment.submissions, {
    onDelete: 'CASCADE',
  })
  assignment!: Assignment;

  @ManyToOne(() => Auth, (user) => user.submissions, {
    onDelete: 'CASCADE',
  })
  user!: Auth;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl!: string;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.pending,
  })
  status!: SubmissionStatus;
}