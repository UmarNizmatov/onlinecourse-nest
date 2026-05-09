import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';
import { user_role } from './role.enum';
@Entity('Auth')
export class Auth extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;
  @Column({ type: 'varchar' })
  email!: string;
  @Column({ type: 'varchar' })
  password!: string;
  @Column({ type: 'enum', enum: user_role, default: 'student' })
  role!: user_role;
}
