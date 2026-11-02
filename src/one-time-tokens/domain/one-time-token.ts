import { OneTimeTokenTypeEnum } from '../one-time-token-type.enum';

export class OneTimeToken {
  id!: string;
  email!: string;
  type!: OneTimeTokenTypeEnum;
  tokenHash!: string;
  expiresAt!: Date;
  usedAt!: Date | null;
  attempts!: number;
  createdAt!: Date;
}
