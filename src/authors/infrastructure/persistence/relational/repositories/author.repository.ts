import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Author } from '../../../../domain/author';
import { AuthorRepository } from '../../author.repository';
import { AuthorEntity } from '../entities/author.entity';
import { AuthorMapper } from '../mappers/author.mapper';

@Injectable()
export class AuthorRelationalRepository implements AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}

  async create(data: Author): Promise<Author> {
    const persistenceModel = AuthorMapper.toPersistence(data);
    const newEntity = await this.authorRepository.save(
      this.authorRepository.create(persistenceModel),
    );
    return AuthorMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Author[]> {
    const entities = await this.authorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return entities.map((entity) => AuthorMapper.toDomain(entity));
  }

  async findById(id: Author['id']): Promise<NullableType<Author>> {
    const entity = await this.authorRepository.findOne({ where: { id } });
    return entity ? AuthorMapper.toDomain(entity) : null;
  }

  async update(
    id: Author['id'],
    payload: DeepPartial<Author>,
  ): Promise<NullableType<Author>> {
    const entity = await this.authorRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    const updatedEntity = await this.authorRepository.save(
      this.authorRepository.create(
        AuthorMapper.toPersistence({
          ...AuthorMapper.toDomain(entity),
          ...payload,
        } as Author),
      ),
    );
    return AuthorMapper.toDomain(updatedEntity);
  }

  async remove(id: Author['id']): Promise<void> {
    await this.authorRepository.softDelete(id);
  }
}
