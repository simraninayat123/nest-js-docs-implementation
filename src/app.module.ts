// here associate the token CatsService with the class CatsService from the cats.service.ts file.
// this is called registration
// dependency analysis (or "creating the dependency graph") is transitive ->
// dependency graph ensures that dependencies are resolved in the correct order, essentially "bottom up"

import { Module } from '@nestjs/common';
import { CustomProviderModule } from './custom-providers/custom-provider.module';

@Module({
  imports: [CustomProviderModule],
})
export class AppModule {}
