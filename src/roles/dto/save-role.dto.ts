import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Permission } from '../../permissions/permission.enum';

const maxLengthMessage = {
  message: i18nValidationMessage('validation.maxLength'),
};

export class SaveRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, maxLengthMessage)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, maxLengthMessage)
  description?: string | null;

  @IsArray()
  @ArrayUnique()
  @IsEnum(Permission, { each: true })
  permissions!: Permission[];
}
