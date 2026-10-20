import { NestFactory } from '@nestjs/core';
import { AuthorSeedService } from './author/author-seed.service';
import { BookSeedService } from './book/book-seed.service';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(AuthorSeedService).run();
  await app.get(BookSeedService).run();

  await app.close();
};

void runSeed();
