import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { SocialAccount } from './domain/social-account';
import { SocialAccountRepository } from './infrastructure/persistence/social-account.repository';

@Injectable()
export class SocialAccountsService {
  constructor(
    private readonly socialAccountRepository: SocialAccountRepository,
  ) {}

  create(
    data: Omit<SocialAccount, 'id' | 'createdAt'>,
  ): Promise<SocialAccount> {
    return this.socialAccountRepository.create(data);
  }

  findByProviderUserId(
    provider: SocialAccount['provider'],
    providerUserId: SocialAccount['providerUserId'],
  ): Promise<NullableType<SocialAccount>> {
    return this.socialAccountRepository.findByProviderUserId(
      provider,
      providerUserId,
    );
  }
}
