import { User } from '../../users/domain/user';

export class LoginResponseDto {
  token!: string;
  tokenExpires!: number;
  user!: User;
}
