import { NullableType } from '../../../utils/types/nullable.type';
import { SocialAccount } from '../../domain/social-account';

export abstract class SocialAccountRepository {
  abstract create(
    data: Omit<SocialAccount, 'id' | 'createdAt'>,
  ): Promise<SocialAccount>;

  abstract findByProviderUserId(
    provider: SocialAccount['provider'],
    providerUserId: SocialAccount['providerUserId'],
  ): Promise<NullableType<SocialAccount>>;
}
