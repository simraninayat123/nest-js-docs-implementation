import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { join } from 'node:path';
import { AllConfigType } from '../config/config.type';
import { MailerService } from '../mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';

type MailTemplate = 'welcome' | 'magic-link' | 'otp' | 'reminder';

type MailStrings = Record<string, string> & {
  subject: string;
  text: string;
};

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
    private readonly i18n: I18nService,
  ) {}

  welcome(mailData: MailData<{ name: string }>): Promise<void> {
    return this.send('welcome', mailData);
  }

  magicLink(mailData: MailData<{ hash: string }>): Promise<void> {
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', { infer: true }) +
        '/magic-link',
    );
    url.searchParams.set('hash', mailData.data.hash);

    return this.send('magic-link', {
      ...mailData,
      data: { url: url.toString() },
    });
  }

  otp(mailData: MailData<{ code: string }>): Promise<void> {
    return this.send('otp', mailData);
  }

  reminder(mailData: MailData<{ message: string }>): Promise<void> {
    return this.send('reminder', mailData);
  }

  private async send(
    template: MailTemplate,
    { to, data, lang }: MailData<Record<string, string>>,
  ): Promise<void> {
    const strings = this.i18n.t<string, MailStrings>(`mail.${template}`, {
      lang: lang ?? I18nContext.current()?.lang,
      args: data,
    });

    await this.mailerService.sendMail({
      to,
      subject: strings.subject,
      text: strings.text,
      templatePath: join(this.templatesDir, `${template}.hbs`),
      context: { ...data, ...strings },
    });
  }
}
