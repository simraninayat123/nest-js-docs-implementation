import { SocialAccount } from '../../../../domain/social-account';
import { SocialAccountEntity } from '../entities/social-account.entity';

export class SocialAccountMapper {
  static toDomain(raw: SocialAccountEntity): SocialAccount {
    const domainEntity = new SocialAccount();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.provider = raw.provider;
    domainEntity.providerUserId = raw.providerUserId;
    domainEntity.createdAt = raw.createdAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: SocialAccount): SocialAccountEntity {
    const persistenceEntity = new SocialAccountEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.providerUserId = domainEntity.providerUserId;
    persistenceEntity.createdAt = domainEntity.createdAt;
    return persistenceEntity;
  }
}
