import { IsNotEmpty, IsString } from 'class-validator';

export class AuthMagicLinkConfirmDto {
  @IsString()
  @IsNotEmpty()
  hash!: string;
}
