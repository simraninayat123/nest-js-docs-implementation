import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import ms from 'ms';
import { AllConfigType } from '../config/config.type';
import { OneTimeTokensService } from './one-time-tokens.service';

@Injectable()
export class OneTimeTokensCleanupService {
  private readonly logger = new Logger(OneTimeTokensCleanupService.name);

  constructor(
    private readonly oneTimeTokensService: OneTimeTokensService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'one-time-tokens-cleanup' })
  async deleteExpired(): Promise<void> {
    const retention = this.configService.getOrThrow(
      'auth.oneTimeTokenRetention',
      { infer: true },
    );
    const before = new Date(Date.now() - ms(retention));

    try {
      const deleted =
        await this.oneTimeTokensService.deleteExpiredBefore(before);
      this.logger.log(`Deleted ${deleted} expired one-time tokens`);
    } catch (error) {
      this.logger.error('One-time token cleanup failed', error);
    }
  }
}
