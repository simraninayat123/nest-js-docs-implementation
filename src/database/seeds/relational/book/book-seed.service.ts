import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuthorEntity } from '../../../../authors/infrastructure/persistence/relational/entities/author.entity';
import { BookEntity } from '../../../../books/infrastructure/persistence/relational/entities/book.entity';

@Injectable()
export class BookSeedService {
  constructor(
    @InjectRepository(BookEntity)
    private repository: Repository<BookEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async run() {
    const books = [
      {
        title: 'Nineteen Eighty-Four',
        isbn: '9780451524935',
        publishedYear: 1949,
        authorNames: ['George Orwell'],
      },
      {
        title: 'Animal Farm',
        isbn: '9780451526342',
        publishedYear: 1945,
        authorNames: ['George Orwell'],
      },
      {
        title: 'Pride and Prejudice',
        isbn: '9780141439518',
        publishedYear: 1813,
        authorNames: ['Jane Austen'],
      },
      {
        title: 'Emma',
        isbn: '9780141439587',
        publishedYear: 1815,
        authorNames: ['Jane Austen'],
      },
      {
        title: 'The Hobbit',
        isbn: '9780547928227',
        publishedYear: 1937,
        authorNames: ['J.R.R. Tolkien'],
      },
      {
        title: 'To Kill a Mockingbird',
        isbn: '9780061120084',
        publishedYear: 1960,
        authorNames: ['Harper Lee'],
      },
      {
        title: 'Good Omens',
        isbn: '9780060853983',
        publishedYear: 1990,
        authorNames: ['Terry Pratchett', 'Neil Gaiman'],
      },
    ];

    for (const { authorNames, ...book } of books) {
      const exists = await this.repository.exists({
        where: { isbn: book.isbn },
        withDeleted: true,
      });
      if (exists) {
        continue;
      }

      const authors = await this.authorRepository.findBy({
        name: In(authorNames),
      });
      if (authors.length !== authorNames.length) {
        throw new Error(`Missing authors for book "${book.title}"`);
      }

      await this.repository.save(this.repository.create({ ...book, authors }));
    }
  }
}
