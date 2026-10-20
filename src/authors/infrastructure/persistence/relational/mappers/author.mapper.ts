import { Author } from '../../../../domain/author';
import { AuthorEntity } from '../entities/author.entity';

export class AuthorMapper {
  static toDomain(raw: AuthorEntity): Author {
    const domainEntity = new Author();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.bio = raw.bio;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Author): AuthorEntity {
    const persistenceEntity = new AuthorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.bio = domainEntity.bio;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
