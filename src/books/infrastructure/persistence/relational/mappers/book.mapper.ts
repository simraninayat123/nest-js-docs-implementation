import { AuthorEntity } from '../../../../../authors/infrastructure/persistence/relational/entities/author.entity';
import { AuthorMapper } from '../../../../../authors/infrastructure/persistence/relational/mappers/author.mapper';
import { Book } from '../../../../domain/book';
import { BookEntity } from '../entities/book.entity';

export class BookMapper {
  static toDomain(raw: BookEntity): Book {
    const domainEntity = new Book();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.isbn = raw.isbn;
    domainEntity.publishedYear = raw.publishedYear;
    if (raw.author) {
      domainEntity.author = AuthorMapper.toDomain(raw.author);
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Book): BookEntity {
    const persistenceEntity = new BookEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.isbn = domainEntity.isbn;
    persistenceEntity.publishedYear = domainEntity.publishedYear;

    const author = new AuthorEntity();
    author.id = domainEntity.author.id;
    persistenceEntity.author = author;

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
