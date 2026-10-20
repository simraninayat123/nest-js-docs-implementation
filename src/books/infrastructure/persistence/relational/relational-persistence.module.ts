import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRepository } from '../book.repository';
import { BookEntity } from './entities/book.entity';
import { BookRelationalRepository } from './repositories/book.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  providers: [
    {
      provide: BookRepository,
      useClass: BookRelationalRepository,
    },
  ],
  exports: [BookRepository],
})
export class RelationalBookPersistenceModule {}
