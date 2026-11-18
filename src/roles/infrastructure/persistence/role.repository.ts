import { NullableType } from '../../../utils/types/nullable.type';
import { Role } from '../../domain/role';

export type RoleData = Pick<Role, 'name' | 'description' | 'permissions'>;

export abstract class RoleRepository {
  abstract create(data: RoleData): Promise<Role>;

  abstract findAll(): Promise<Role[]>;

  abstract findById(id: Role['id']): Promise<NullableType<Role>>;

  abstract findByName(name: Role['name']): Promise<NullableType<Role>>;

  abstract update(id: Role['id'], data: RoleData): Promise<Role>;

  abstract remove(id: Role['id']): Promise<void>;
}
