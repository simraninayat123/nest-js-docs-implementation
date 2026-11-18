import { RoleMapper } from '../../../../../roles/infrastructure/persistence/relational/mappers/role.mapper';
import { NewUser, User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.provider = raw.provider;
    domainEntity.role = RoleMapper.toDomain(raw.role);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: NewUser): UserEntity {
    const persistenceEntity = new UserEntity();
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.provider = domainEntity.provider;
    return persistenceEntity;
  }
}
