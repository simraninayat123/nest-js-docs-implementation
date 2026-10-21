import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { MailConfig } from '../mail/config/mail-config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService<{ mail: MailConfig }>) {
    const user = this.configService.get('mail.user', { infer: true });
    const pass = this.configService.get('mail.password', { infer: true });

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host', { infer: true }),
      port: this.configService.get('mail.port', { infer: true }),
      ignoreTLS: this.configService.get('mail.ignoreTLS', { infer: true }),
      secure: this.configService.get('mail.secure', { infer: true }),
      requireTLS: this.configService.get('mail.requireTLS', { infer: true }),
      auth: user ? { user, pass } : undefined,
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    const template = await readFile(templatePath, 'utf-8');
    const html = Handlebars.compile(template, { strict: true })(context);

    const defaultName = this.configService.get('mail.defaultName', {
      infer: true,
    });
    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from ?? `"${defaultName}" <${defaultEmail}>`,
      html: mailOptions.html ?? html,
    });
  }
}
