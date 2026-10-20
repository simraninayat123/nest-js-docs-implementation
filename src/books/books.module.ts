import { Module } from '@nestjs/common';
import { RelationalBookPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalBookPersistenceModule],
  exports: [RelationalBookPersistenceModule],
})
export class BooksModule {}
