import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Author } from '../../domain/author';

export abstract class AuthorRepository {
  abstract create(
    data: Omit<Author, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Author>;

  abstract findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Author[]>;

  abstract findById(id: Author['id']): Promise<NullableType<Author>>;

  abstract update(
    id: Author['id'],
    payload: DeepPartial<Author>,
  ): Promise<NullableType<Author>>;

  abstract remove(id: Author['id']): Promise<void>;
}
