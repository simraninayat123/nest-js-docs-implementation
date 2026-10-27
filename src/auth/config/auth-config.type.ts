import ms from 'ms';

export type AuthConfig = {
  secret: string;
  expires: ms.StringValue;
  magicLinkSecret: string;
  magicLinkExpires: ms.StringValue;
};
