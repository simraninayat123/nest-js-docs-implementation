import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { I18nService } from 'nestjs-i18n';
import { MailService } from '../mail/mail.service';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { Reminder } from './domain/reminder';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { ReminderResponseDto } from './dto/reminder-response.dto';
import { ReminderRepository } from './infrastructure/persistence/reminder.repository';

const MAX_REMINDERS_PER_USER = 10;
const MIN_INTERVAL_MS = 60_000;

@Injectable()
export class RemindersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly reminderRepository: ReminderRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const reminders = await this.reminderRepository.findAll();
    for (const reminder of reminders) {
      try {
        this.schedule(reminder);
      } catch (error) {
        this.logger.error(`Could not schedule reminder ${reminder.id}`, error);
      }
    }
    this.logger.log(`Scheduled ${reminders.length} reminders`);
  }

  async create(
    user: User,
    dto: CreateReminderDto,
    language: string,
  ): Promise<ReminderResponseDto> {
    this.validateCronTime(dto.cronTime, dto.timeZone);

    if (
      (await this.reminderRepository.countByUserId(user.id)) >=
      MAX_REMINDERS_PER_USER
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          reminder: 'tooManyReminders',
        },
      });
    }

    const reminder = await this.reminderRepository.create({
      userId: user.id,
      message: dto.message,
      cronTime: dto.cronTime,
      timeZone: dto.timeZone ?? null,
      language: this.i18n.getSupportedLanguages().includes(language)
        ? language
        : null,
    });

    this.schedule(reminder);

    return this.toResponse(reminder);
  }

  async findAll(user: User): Promise<ReminderResponseDto[]> {
    const reminders = await this.reminderRepository.findByUserId(user.id);
    return reminders.map((reminder) => this.toResponse(reminder));
  }

  async findOne(user: User, id: Reminder['id']): Promise<ReminderResponseDto> {
    return this.toResponse(await this.getOwnReminder(user, id));
  }

  async remove(user: User, id: Reminder['id']): Promise<void> {
    const reminder = await this.getOwnReminder(user, id);
    await this.reminderRepository.remove(reminder.id);
    this.unschedule(reminder.id);
  }

  private async getOwnReminder(
    user: User,
    id: Reminder['id'],
  ): Promise<Reminder> {
    const reminder = await this.reminderRepository.findById(id);

    if (!reminder || reminder.userId !== user.id) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          reminder: 'notFound',
        },
      });
    }

    return reminder;
  }

  private validateCronTime(cronTime: string, timeZone?: string): void {
    let nextRuns: Date[];

    try {
      nextRuns = new CronTime(cronTime, timeZone)
        .sendAt(2)
        .map((date) => date.toJSDate());
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          cronTime: 'invalidCronTime',
        },
      });
    }

    if (nextRuns[1].getTime() - nextRuns[0].getTime() < MIN_INTERVAL_MS) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          cronTime: 'tooFrequent',
        },
      });
    }
  }

  private schedule(reminder: Reminder): void {
    const job = CronJob.from({
      cronTime: reminder.cronTime,
      timeZone: reminder.timeZone ?? undefined,
      onTick: () => this.send(reminder.id),
      waitForCompletion: true,
    });

    this.schedulerRegistry.addCronJob(this.jobName(reminder.id), job);
    job.start();
  }

  private unschedule(id: Reminder['id']): void {
    const name = this.jobName(id);
    if (this.schedulerRegistry.doesExist('cron', name)) {
      this.schedulerRegistry.deleteCronJob(name);
    }
  }

  private async send(id: Reminder['id']): Promise<void> {
    try {
      const reminder = await this.reminderRepository.findById(id);
      const user = reminder
        ? await this.usersService.findById(reminder.userId)
        : null;

      if (!reminder || !user) {
        this.unschedule(id);
        return;
      }

      await this.mailService.reminder({
        to: user.email,
        data: { message: reminder.message },
        lang: reminder.language ?? undefined,
      });
      this.logger.log(`Sent reminder ${id}`);
    } catch (error) {
      this.logger.error(`Failed to send reminder ${id}`, error);
    }
  }

  private jobName(id: Reminder['id']): string {
    return `reminder-${id}`;
  }

  private toResponse(reminder: Reminder): ReminderResponseDto {
    const name = this.jobName(reminder.id);
    let nextRunAt: Date | null = null;

    if (this.schedulerRegistry.doesExist('cron', name)) {
      try {
        nextRunAt = this.schedulerRegistry
          .getCronJob(name)
          .nextDate()
          .toJSDate();
      } catch {
        nextRunAt = null;
      }
    }

    return {
      id: reminder.id,
      message: reminder.message,
      cronTime: reminder.cronTime,
      timeZone: reminder.timeZone,
      language: reminder.language,
      nextRunAt,
      createdAt: reminder.createdAt,
    };
  }
}
