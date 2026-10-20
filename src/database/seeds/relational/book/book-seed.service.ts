import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const count = await this.repository.count();

    if (!count) {
      const orwell = await this.authorRepository.findOneByOrFail({
        name: 'George Orwell',
      });
      const austen = await this.authorRepository.findOneByOrFail({
        name: 'Jane Austen',
      });
      const tolkien = await this.authorRepository.findOneByOrFail({
        name: 'J.R.R. Tolkien',
      });
      const lee = await this.authorRepository.findOneByOrFail({
        name: 'Harper Lee',
      });

      await this.repository.save(
        this.repository.create([
          {
            title: 'Nineteen Eighty-Four',
            isbn: '9780451524935',
            publishedYear: 1949,
            author: orwell,
          },
          {
            title: 'Animal Farm',
            isbn: '9780451526342',
            publishedYear: 1945,
            author: orwell,
          },
          {
            title: 'Pride and Prejudice',
            isbn: '9780141439518',
            publishedYear: 1813,
            author: austen,
          },
          {
            title: 'Emma',
            isbn: '9780141439587',
            publishedYear: 1815,
            author: austen,
          },
          {
            title: 'The Hobbit',
            isbn: '9780547928227',
            publishedYear: 1937,
            author: tolkien,
          },
          {
            title: 'To Kill a Mockingbird',
            isbn: '9780061120084',
            publishedYear: 1960,
            author: lee,
          },
        ]),
      );
    }
  }
}
