import { registerAs } from '@nestjs/config';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
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
  AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_OTP_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_OTP_TOKEN_EXPIRES_IN!: string;

  @IsInt()
  @Min(1)
  AUTH_OTP_MAX_ATTEMPTS!: number;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET!,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN! as ms.StringValue,
    magicLinkExpires: process.env
      .AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN! as ms.StringValue,
    otpSecret: process.env.AUTH_OTP_SECRET!,
    otpExpires: process.env.AUTH_OTP_TOKEN_EXPIRES_IN! as ms.StringValue,
    otpMaxAttempts: parseInt(process.env.AUTH_OTP_MAX_ATTEMPTS!, 10),
  };
});
