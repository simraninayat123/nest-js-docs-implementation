import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { FileConfig, FileDriver } from './file-config.type';

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER!: FileDriver;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  ACCESS_KEY_ID!: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  SECRET_ACCESS_KEY!: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  AWS_DEFAULT_S3_BUCKET!: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  AWS_S3_REGION!: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  AWS_S3_ENDPOINT?: string;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver: process.env.FILE_DRIVER as FileDriver,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    awsS3Endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    maxFileSize: 5242880,
  };
});
