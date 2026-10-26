import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import appConfig from './config/app.config';
import { CustomProviderModule } from './custom-providers/custom-provider.module';
import databaseConfig from './database/config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import fileConfig from './files/config/file.config';
import { FilesModule } from './files/files.module';
import mailConfig from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CustomProviderModule,
    AuthorsModule,
    BooksModule,
    MailModule,
    FilesModule,
  ],
})
export class AppModule {}
