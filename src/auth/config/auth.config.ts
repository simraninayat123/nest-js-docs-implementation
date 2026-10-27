import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import ms from 'ms';
import validateConfig from '../../utils/validate-config';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AUTH_JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_TOKEN_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_MAGIC_LINK_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN!: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET!,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN! as ms.StringValue,
    magicLinkSecret: process.env.AUTH_MAGIC_LINK_SECRET!,
    magicLinkExpires: process.env
      .AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN! as ms.StringValue,
  };
});
