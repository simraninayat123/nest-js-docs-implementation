import { Injectable } from '@nestjs/common';
import { CatsProvider } from './custom-provider.types';
import type { Cat, CatsRepository } from './custom-provider.types';

@Injectable()
export class CatsService extends CatsProvider implements CatsRepository {
  private readonly cats: Cat[] = [
    { name: 'Milo', age: 2 },
    { name: 'Luna', age: 4 },
  ];
  findAll(): Cat[] {
    return this.cats;
  }
}
