import { Inject, Injectable } from '@nestjs/common';
import { CatsService } from './cats.service';
import {
  APP_CONFIG,
  CATS_ALIAS,
  CATS_REPOSITORY,
  DATABASE_CONNECTION,
} from './custom-provider.tokens';
import { CatsProvider } from './custom-provider.types';
import type { CatsRepository } from './custom-provider.types';

@Injectable()
export class CustomProviderService {
  constructor(
    private readonly catsService: CatsService,
    @Inject(CatsProvider) private readonly abstractProvider: CatsProvider,
    @Inject(APP_CONFIG)
    private readonly config: { environment: string; apiUrl: string },
    @Inject(DATABASE_CONNECTION)
    private readonly database: {
      host: string;
      database: string;
      connected: boolean;
    },
    @Inject(CATS_REPOSITORY) private readonly repository: CatsRepository,
    @Inject('CATS_OPTIONS')
    private readonly options: { source: string; cacheEnabled: boolean },
    @Inject(CATS_ALIAS) private readonly catsAlias: CatsService,
  ) {}

  getExamples() {
    return {
      standardProvider: this.catsService.findAll(),
      abstractClassProvider: this.abstractProvider.findAll(),
      valueProvider: this.config,
      nonClassProvider: this.database,
      interfaceTokenWithString: this.repository.findAll(),
      factoryProvider: this.options,
      aliasProvider: {
        cats: this.catsAlias.findAll(),
        sameInstance: this.catsService === this.catsAlias,
      },
    };
  }
}
