export class ReminderResponseDto {
  id!: string;
  message!: string;
  cronTime!: string;
  timeZone!: string | null;
  language!: string | null;
  nextRunAt!: Date | null;
  createdAt!: Date;
}
