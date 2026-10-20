import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from '../../../../authors/infrastructure/persistence/relational/entities/author.entity';
import { BookEntity } from '../../../../books/infrastructure/persistence/relational/entities/book.entity';
import { BookSeedService } from './book-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, AuthorEntity])],
  providers: [BookSeedService],
  exports: [BookSeedService],
})
export class BookSeedModule {}
