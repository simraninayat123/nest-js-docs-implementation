import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { OneTimeToken } from './domain/one-time-token';
import { OneTimeTokenRepository } from './infrastructure/persistence/one-time-token.repository';

@Injectable()
export class OneTimeTokensService {
  constructor(
    private readonly oneTimeTokenRepository: OneTimeTokenRepository,
  ) {}

  create(data: Omit<OneTimeToken, 'id' | 'createdAt'>): Promise<OneTimeToken> {
    return this.oneTimeTokenRepository.create(data);
  }

  findByTokenHash(
    tokenHash: OneTimeToken['tokenHash'],
    type: OneTimeToken['type'],
  ): Promise<NullableType<OneTimeToken>> {
    return this.oneTimeTokenRepository.findByTokenHash(tokenHash, type);
  }

  markAsUsed(id: OneTimeToken['id']): Promise<boolean> {
    return this.oneTimeTokenRepository.markAsUsed(id);
  }

  deleteUnusedByEmail(
    email: OneTimeToken['email'],
    type: OneTimeToken['type'],
  ): Promise<void> {
    return this.oneTimeTokenRepository.deleteUnusedByEmail(email, type);
  }
}
