import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MicrosoftConfig } from './microsoft-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  MICROSOFT_CLIENT_ID?: string;
}

export default registerAs<MicrosoftConfig>('microsoft', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: process.env.MICROSOFT_CLIENT_ID || undefined,
  };
});
