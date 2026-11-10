import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Reminder } from '../../../../domain/reminder';
import { ReminderRepository } from '../../reminder.repository';
import { ReminderEntity } from '../entities/reminder.entity';
import { ReminderMapper } from '../mappers/reminder.mapper';

@Injectable()
export class ReminderRelationalRepository implements ReminderRepository {
  constructor(
    @InjectRepository(ReminderEntity)
    private readonly reminderRepository: Repository<ReminderEntity>,
  ) {}

  async create(data: Reminder): Promise<Reminder> {
    const persistenceModel = ReminderMapper.toPersistence(data);
    const newEntity = await this.reminderRepository.save(
      this.reminderRepository.create(persistenceModel),
    );
    return ReminderMapper.toDomain(newEntity);
  }

  async findById(id: Reminder['id']): Promise<NullableType<Reminder>> {
    const entity = await this.reminderRepository.findOne({ where: { id } });
    return entity ? ReminderMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: Reminder['userId']): Promise<Reminder[]> {
    const entities = await this.reminderRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
    return entities.map((entity) => ReminderMapper.toDomain(entity));
  }

  async findAll(): Promise<Reminder[]> {
    const entities = await this.reminderRepository.find();
    return entities.map((entity) => ReminderMapper.toDomain(entity));
  }

  countByUserId(userId: Reminder['userId']): Promise<number> {
    return this.reminderRepository.count({ where: { userId } });
  }

  async remove(id: Reminder['id']): Promise<void> {
    await this.reminderRepository.delete({ id });
  }
}
