import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { OneTimeToken } from '../../../../domain/one-time-token';
import { OneTimeTokenRepository } from '../../one-time-token.repository';
import { OneTimeTokenEntity } from '../entities/one-time-token.entity';
import { OneTimeTokenMapper } from '../mappers/one-time-token.mapper';

@Injectable()
export class OneTimeTokenRelationalRepository implements OneTimeTokenRepository {
  constructor(
    @InjectRepository(OneTimeTokenEntity)
    private readonly oneTimeTokenRepository: Repository<OneTimeTokenEntity>,
  ) {}

  async create(data: OneTimeToken): Promise<OneTimeToken> {
    const persistenceModel = OneTimeTokenMapper.toPersistence(data);
    const newEntity = await this.oneTimeTokenRepository.save(
      this.oneTimeTokenRepository.create(persistenceModel),
    );
    return OneTimeTokenMapper.toDomain(newEntity);
  }

  async findByTokenHash(
    tokenHash: OneTimeToken['tokenHash'],
    type: OneTimeToken['type'],
  ): Promise<NullableType<OneTimeToken>> {
    const entity = await this.oneTimeTokenRepository.findOne({
      where: { tokenHash, type },
    });
    return entity ? OneTimeTokenMapper.toDomain(entity) : null;
  }

  async markAsUsed(id: OneTimeToken['id']): Promise<boolean> {
    const now = new Date();
    const result = await this.oneTimeTokenRepository.update(
      { id, usedAt: IsNull(), expiresAt: MoreThan(now) },
      { usedAt: now },
    );
    return (result.affected ?? 0) > 0;
  }

  async deleteUnusedByEmail(
    email: OneTimeToken['email'],
    type: OneTimeToken['type'],
  ): Promise<void> {
    await this.oneTimeTokenRepository.delete({
      email,
      type,
      usedAt: IsNull(),
    });
  }
}
