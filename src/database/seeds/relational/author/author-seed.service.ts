import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from '../../../../authors/infrastructure/persistence/relational/entities/author.entity';

@Injectable()
export class AuthorSeedService {
  constructor(
    @InjectRepository(AuthorEntity)
    private repository: Repository<AuthorEntity>,
  ) {}

  async run() {
    const authors = [
      {
        name: 'George Orwell',
        bio: 'English novelist and essayist known for dystopian fiction.',
      },
      {
        name: 'Jane Austen',
        bio: 'English novelist known for romantic fiction set among the landed gentry.',
      },
      {
        name: 'J.R.R. Tolkien',
        bio: 'English writer and philologist, author of Middle-earth stories.',
      },
      {
        name: 'Harper Lee',
        bio: null,
      },
      {
        name: 'Terry Pratchett',
        bio: 'English author of fantasy novels, best known for the Discworld series.',
      },
      {
        name: 'Neil Gaiman',
        bio: 'English author of novels, comics and screenplays.',
      },
    ];

    for (const author of authors) {
      const exists = await this.repository.exists({
        where: { name: author.name },
        withDeleted: true,
      });

      if (!exists) {
        await this.repository.save(this.repository.create(author));
      }
    }
  }
}
