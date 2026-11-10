import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cronTime!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  timeZone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message!: string;
}
