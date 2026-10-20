import { Author } from '../../authors/domain/author';

export class Book {
  id!: string;
  title!: string;
  isbn!: string;
  publishedYear!: number | null;
  author!: Author;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}
