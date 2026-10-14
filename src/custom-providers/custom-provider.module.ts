import { Module } from '@nestjs/common';
import { CatsController } from './custom-provider.controller';
import { CatsService } from './cats.service';
import { MockCatsService } from './mock-cats.service';
import { CustomProviderService } from './custom-provider.service';
import {
  APP_CONFIG,
  CATS_ALIAS,
  CATS_REPOSITORY,
  DATABASE_CONNECTION,
} from './custom-provider.tokens';
import { CatsProvider } from './custom-provider.types';

@Module({
  controllers: [CatsController],
  providers: [
    CatsService,
    CustomProviderService,
    {
      provide: APP_CONFIG,
      useValue: {
        environment: 'development',
        apiUrl: 'https://api.example.com',
      },
    },
    {
      provide: DATABASE_CONNECTION,
      useValue: { host: 'localhost', database: 'cats', connected: true },
    },
    { provide: CATS_REPOSITORY, useClass: MockCatsService },
    { provide: CatsProvider, useClass: CatsService },
    {
      provide: 'CATS_OPTIONS',
      useFactory: (config: { environment: string }) => ({
        source: config.environment,
        cacheEnabled: config.environment === 'production',
      }),
      inject: [APP_CONFIG],
    },
    { provide: CATS_ALIAS, useExisting: CatsService },
  ],
  exports: [
    CustomProviderService,
    CatsService,
    APP_CONFIG,
    DATABASE_CONNECTION,
    CATS_REPOSITORY,
    CATS_ALIAS,
  ],
})
export class CustomProviderModule {}
