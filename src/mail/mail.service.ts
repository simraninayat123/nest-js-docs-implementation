import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { MailerService } from '../mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  private readonly templatesDir = join(
    process.cwd(),
    'src',
    'mail',
    'mail-templates',
  );

  constructor(private readonly mailerService: MailerService) {}

  async welcome(mailData: MailData<{ name: string }>): Promise<void> {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Welcome to the library!',
      text: `Hello ${mailData.data.name}, welcome to the library!`,
      templatePath: join(this.templatesDir, 'welcome.hbs'),
      context: {
        name: mailData.data.name,
      },
    });
  }
}
