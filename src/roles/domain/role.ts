import { Permission } from '../../permissions/permission.enum';

export class Role {
  id!: string;
  name!: string;
  description!: string | null;
  permissions!: Permission[];
  createdAt!: Date;
  updatedAt!: Date;
}
