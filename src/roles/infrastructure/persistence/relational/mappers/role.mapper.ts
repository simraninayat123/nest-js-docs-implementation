import { Role } from '../../../../domain/role';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const domainEntity = new Role();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.permissions = raw.permissions;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }
}
