import { FacebookConfig } from '../auth-facebook/config/facebook-config.type';
import { GoogleConfig } from '../auth-google/config/google-config.type';
import { MicrosoftConfig } from '../auth-microsoft/config/microsoft-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../files/config/file-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  facebook: FacebookConfig;
  file: FileConfig;
  google: GoogleConfig;
  mail: MailConfig;
  microsoft: MicrosoftConfig;
};
