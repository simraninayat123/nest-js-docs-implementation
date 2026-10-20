import { Author } from '../../../authors/domain/author';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Book } from '../../domain/book';

export abstract class BookRepository {
  abstract create(
    data: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Book>;

  abstract findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Book[]>;

  abstract findById(id: Book['id']): Promise<NullableType<Book>>;

  abstract findByIsbn(isbn: Book['isbn']): Promise<NullableType<Book>>;

  abstract findManyByAuthorId(authorId: Author['id']): Promise<Book[]>;

  abstract update(
    id: Book['id'],
    payload: DeepPartial<Book>,
  ): Promise<NullableType<Book>>;

  abstract remove(id: Book['id']): Promise<void>;
}
