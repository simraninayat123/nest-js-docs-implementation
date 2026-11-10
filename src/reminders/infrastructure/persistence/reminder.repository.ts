import { NullableType } from '../../../utils/types/nullable.type';
import { Reminder } from '../../domain/reminder';

export abstract class ReminderRepository {
  abstract create(data: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder>;

  abstract findById(id: Reminder['id']): Promise<NullableType<Reminder>>;

  abstract findByUserId(userId: Reminder['userId']): Promise<Reminder[]>;

  abstract findAll(): Promise<Reminder[]>;

  abstract countByUserId(userId: Reminder['userId']): Promise<number>;

  abstract remove(id: Reminder['id']): Promise<void>;
}
