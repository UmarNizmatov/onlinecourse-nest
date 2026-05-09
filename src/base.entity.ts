import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @CreateDateColumn()
  created_at!: string;
  @UpdateDateColumn()
  updated_at!: string;
  @DeleteDateColumn()
  deleted_at!: string;
}
