import { Role } from '../../roles/domain/role';

export class User {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  provider!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}

export type NewUser = Omit<
  User,
  'id' | 'role' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
