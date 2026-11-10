import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { RelationalReminderPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [RelationalReminderPersistenceModule, MailModule, UsersModule],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
