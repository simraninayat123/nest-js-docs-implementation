import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthOtpConfirmDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}
