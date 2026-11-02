import { Module } from '@nestjs/common';
import { RelationalOneTimeTokenPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { OneTimeTokensService } from './one-time-tokens.service';

@Module({
  imports: [RelationalOneTimeTokenPersistenceModule],
  providers: [OneTimeTokensService],
  exports: [OneTimeTokensService],
})
export class OneTimeTokensModule {}
