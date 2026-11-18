import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { SystemRole } from '../../../../../roles/system-role.enum';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', length: 50, default: AuthProvidersEnum.email })
  provider!: string;

  @Index()
  @Column({ type: 'uuid', default: SystemRole.User })
  roleId!: string;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role!: RoleEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
