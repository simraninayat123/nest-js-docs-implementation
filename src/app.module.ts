import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import facebookConfig from './auth-facebook/config/facebook.config';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import googleConfig from './auth-google/config/google.config';
import { AuthMicrosoftModule } from './auth-microsoft/auth-microsoft.module';
import microsoftConfig from './auth-microsoft/config/microsoft.config';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
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
import { RemindersModule } from './reminders/reminders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        mailConfig,
        fileConfig,
        googleConfig,
        facebookConfig,
        microsoftConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    CustomProviderModule,
    AuthorsModule,
    BooksModule,
    MailModule,
    FilesModule,
    UsersModule,
    AuthModule,
    AuthGoogleModule,
    AuthFacebookModule,
    AuthMicrosoftModule,
    RemindersModule,
  ],
})
export class AppModule {}
