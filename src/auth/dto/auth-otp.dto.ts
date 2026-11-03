import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthOtpDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
