import { IsNotEmpty, IsString } from 'class-validator';

export class AuthGoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
