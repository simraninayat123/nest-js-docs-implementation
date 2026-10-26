import { registerAs } from '@nestjs/config';
import { IsOptional, IsUrl } from 'class-validator';
import validateConfig from '../utils/validate-config';
import { AppConfig } from './app-config.type';

class EnvironmentVariablesValidator {
  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN?: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
  };
});
