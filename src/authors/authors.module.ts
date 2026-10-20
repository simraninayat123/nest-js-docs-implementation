import { Module } from '@nestjs/common';
import { RelationalAuthorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalAuthorPersistenceModule],
  exports: [RelationalAuthorPersistenceModule],
})
export class AuthorsModule {}
