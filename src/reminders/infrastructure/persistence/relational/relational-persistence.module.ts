import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderRepository } from '../reminder.repository';
import { ReminderEntity } from './entities/reminder.entity';
import { ReminderRelationalRepository } from './repositories/reminder.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReminderEntity])],
  providers: [
    {
      provide: ReminderRepository,
      useClass: ReminderRelationalRepository,
    },
  ],
  exports: [ReminderRepository],
})
export class RelationalReminderPersistenceModule {}
