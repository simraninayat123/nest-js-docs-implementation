import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../../../../../authors/domain/author';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Book } from '../../../../domain/book';
import { BookRepository } from '../../book.repository';
import { BookEntity } from '../entities/book.entity';
import { BookMapper } from '../mappers/book.mapper';

@Injectable()
export class BookRelationalRepository implements BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(data: Book): Promise<Book> {
    const persistenceModel = BookMapper.toPersistence(data);
    const newEntity = await this.bookRepository.save(
      this.bookRepository.create(persistenceModel),
    );
    return (await this.findById(newEntity.id)) as Book;
  }

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Book[]> {
    const entities = await this.bookRepository.find({
      relations: { author: true },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return entities.map((entity) => BookMapper.toDomain(entity));
  }

  async findById(id: Book['id']): Promise<NullableType<Book>> {
    const entity = await this.bookRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    return entity ? BookMapper.toDomain(entity) : null;
  }

  async findByIsbn(isbn: Book['isbn']): Promise<NullableType<Book>> {
    const entity = await this.bookRepository.findOne({
      where: { isbn },
      relations: { author: true },
    });
    return entity ? BookMapper.toDomain(entity) : null;
  }

  async findManyByAuthorId(authorId: Author['id']): Promise<Book[]> {
    const entities = await this.bookRepository.find({
      where: { author: { id: authorId } },
      relations: { author: true },
    });
    return entities.map((entity) => BookMapper.toDomain(entity));
  }

  async update(
    id: Book['id'],
    payload: DeepPartial<Book>,
  ): Promise<NullableType<Book>> {
    const entity = await this.bookRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!entity) {
      return null;
    }

    await this.bookRepository.save(
      this.bookRepository.create(
        BookMapper.toPersistence({
          ...BookMapper.toDomain(entity),
          ...payload,
        } as Book),
      ),
    );
    return this.findById(id);
  }

  async remove(id: Book['id']): Promise<void> {
    await this.bookRepository.softDelete(id);
  }
}
