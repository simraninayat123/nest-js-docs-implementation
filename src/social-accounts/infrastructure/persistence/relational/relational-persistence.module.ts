import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccountRepository } from '../social-account.repository';
import { SocialAccountEntity } from './entities/social-account.entity';
import { SocialAccountRelationalRepository } from './repositories/social-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccountEntity])],
  providers: [
    {
      provide: SocialAccountRepository,
      useClass: SocialAccountRelationalRepository,
    },
  ],
  exports: [SocialAccountRepository],
})
export class RelationalSocialAccountPersistenceModule {}
