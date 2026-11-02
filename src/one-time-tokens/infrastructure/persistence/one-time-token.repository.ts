import { NullableType } from '../../../utils/types/nullable.type';
import { OneTimeToken } from '../../domain/one-time-token';

export abstract class OneTimeTokenRepository {
  abstract create(
    data: Omit<OneTimeToken, 'id' | 'createdAt'>,
  ): Promise<OneTimeToken>;

  abstract findByTokenHash(
    tokenHash: OneTimeToken['tokenHash'],
    type: OneTimeToken['type'],
  ): Promise<NullableType<OneTimeToken>>;

  abstract markAsUsed(id: OneTimeToken['id']): Promise<boolean>;

  abstract deleteUnusedByEmail(
    email: OneTimeToken['email'],
    type: OneTimeToken['type'],
  ): Promise<void>;
}
