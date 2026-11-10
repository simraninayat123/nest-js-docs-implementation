import { Reminder } from '../../../../domain/reminder';
import { ReminderEntity } from '../entities/reminder.entity';

export class ReminderMapper {
  static toDomain(raw: ReminderEntity): Reminder {
    const domainEntity = new Reminder();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.message = raw.message;
    domainEntity.cronTime = raw.cronTime;
    domainEntity.timeZone = raw.timeZone;
    domainEntity.createdAt = raw.createdAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Reminder): ReminderEntity {
    const persistenceEntity = new ReminderEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.message = domainEntity.message;
    persistenceEntity.cronTime = domainEntity.cronTime;
    persistenceEntity.timeZone = domainEntity.timeZone;
    persistenceEntity.createdAt = domainEntity.createdAt;
    return persistenceEntity;
  }
}
