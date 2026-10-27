import { User } from '../../users/domain/user';

export type MagicLinkPayloadType = Pick<User, 'email'>;
