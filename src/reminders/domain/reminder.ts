export class Reminder {
  id!: string;
  userId!: string;
  message!: string;
  cronTime!: string;
  timeZone!: string | null;
  language!: string | null;
  createdAt!: Date;
}
