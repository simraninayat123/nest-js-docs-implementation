import { OneTimeToken } from '../../../../domain/one-time-token';
import { OneTimeTokenEntity } from '../entities/one-time-token.entity';

export class OneTimeTokenMapper {
  static toDomain(raw: OneTimeTokenEntity): OneTimeToken {
    const domainEntity = new OneTimeToken();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.type = raw.type;
    domainEntity.tokenHash = raw.tokenHash;
    domainEntity.expiresAt = raw.expiresAt;
    domainEntity.usedAt = raw.usedAt;
    domainEntity.attempts = raw.attempts;
    domainEntity.createdAt = raw.createdAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: OneTimeToken): OneTimeTokenEntity {
    const persistenceEntity = new OneTimeTokenEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.tokenHash = domainEntity.tokenHash;
    persistenceEntity.expiresAt = domainEntity.expiresAt;
    persistenceEntity.usedAt = domainEntity.usedAt;
    persistenceEntity.attempts = domainEntity.attempts;
    persistenceEntity.createdAt = domainEntity.createdAt;
    return persistenceEntity;
  }
}
