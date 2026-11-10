import { IsNotEmpty, IsString } from 'class-validator';

export class AuthFacebookLoginDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}
