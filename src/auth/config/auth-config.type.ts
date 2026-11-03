import ms from 'ms';

export type AuthConfig = {
  secret: string;
  expires: ms.StringValue;
  magicLinkExpires: ms.StringValue;
  otpSecret: string;
  otpExpires: ms.StringValue;
  otpMaxAttempts: number;
};
