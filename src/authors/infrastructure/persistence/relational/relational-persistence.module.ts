import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorRepository } from '../author.repository';
import { AuthorEntity } from './entities/author.entity';
import { AuthorRelationalRepository } from './repositories/author.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity])],
  providers: [
    {
      provide: AuthorRepository,
      useClass: AuthorRelationalRepository,
    },
  ],
  exports: [AuthorRepository],
})
export class RelationalAuthorPersistenceModule {}
