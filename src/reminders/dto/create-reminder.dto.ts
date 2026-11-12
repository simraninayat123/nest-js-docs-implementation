import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

const maxLengthMessage = {
  message: i18nValidationMessage('validation.maxLength'),
};

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, maxLengthMessage)
  cronTime!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, maxLengthMessage)
  timeZone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, maxLengthMessage)
  message!: string;
}
