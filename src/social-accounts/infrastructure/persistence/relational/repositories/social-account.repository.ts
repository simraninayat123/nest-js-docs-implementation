import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SocialAccount } from '../../../../domain/social-account';
import { SocialAccountRepository } from '../../social-account.repository';
import { SocialAccountEntity } from '../entities/social-account.entity';
import { SocialAccountMapper } from '../mappers/social-account.mapper';

@Injectable()
export class SocialAccountRelationalRepository implements SocialAccountRepository {
  constructor(
    @InjectRepository(SocialAccountEntity)
    private readonly socialAccountRepository: Repository<SocialAccountEntity>,
  ) {}

  async create(data: SocialAccount): Promise<SocialAccount> {
    const persistenceModel = SocialAccountMapper.toPersistence(data);
    const newEntity = await this.socialAccountRepository.save(
      this.socialAccountRepository.create(persistenceModel),
    );
    return SocialAccountMapper.toDomain(newEntity);
  }

  async findByProviderUserId(
    provider: SocialAccount['provider'],
    providerUserId: SocialAccount['providerUserId'],
  ): Promise<NullableType<SocialAccount>> {
    const entity = await this.socialAccountRepository.findOne({
      where: { provider, providerUserId },
    });
    return entity ? SocialAccountMapper.toDomain(entity) : null;
  }
}
