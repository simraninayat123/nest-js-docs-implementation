import { IsNotEmpty, IsString } from 'class-validator';

export class AuthMicrosoftLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
