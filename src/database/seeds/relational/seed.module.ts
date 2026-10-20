import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../../config/database.config';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { AuthorSeedModule } from './author/author-seed.module';
import { BookSeedModule } from './book/book-seed.module';

@Module({
  imports: [
    AuthorSeedModule,
    BookSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options?: DataSourceOptions) => {
        return new DataSource(options as DataSourceOptions).initialize();
      },
    }),
  ],
})
export class SeedModule {}
