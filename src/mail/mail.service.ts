import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { AllConfigType } from '../config/config.type';
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

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

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

  async magicLink(mailData: MailData<{ hash: string }>): Promise<void> {
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', { infer: true }) +
        '/magic-link',
    );
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Your sign-in link',
      text: `Sign in to the library: ${url.toString()}`,
      templatePath: join(this.templatesDir, 'magic-link.hbs'),
      context: {
        url: url.toString(),
      },
    });
  }
}
