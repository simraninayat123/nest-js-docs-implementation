import { Module } from '@nestjs/common';
import { RelationalOneTimeTokenPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { OneTimeTokensCleanupService } from './one-time-tokens-cleanup.service';
import { OneTimeTokensService } from './one-time-tokens.service';

@Module({
  imports: [RelationalOneTimeTokenPersistenceModule],
  providers: [OneTimeTokensService, OneTimeTokensCleanupService],
  exports: [OneTimeTokensService],
})
export class OneTimeTokensModule {}
