import { Module } from '@nestjs/common';
import { RelationalSocialAccountPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SocialAccountsService } from './social-accounts.service';

@Module({
  imports: [RelationalSocialAccountPersistenceModule],
  providers: [SocialAccountsService],
  exports: [SocialAccountsService],
})
export class SocialAccountsModule {}
