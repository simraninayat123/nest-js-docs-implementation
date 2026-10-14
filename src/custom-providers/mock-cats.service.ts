import { Injectable } from '@nestjs/common';
import type { Cat, CatsRepository } from './custom-provider.types';

@Injectable()
export class MockCatsService implements CatsRepository {
  findAll(): Cat[] {
    return [{ name: 'Mock cat', age: 1 }];
  }
}
