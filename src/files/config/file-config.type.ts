export enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
}

export type FileConfig = {
  driver: FileDriver;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsS3Region?: string;
  awsS3Endpoint?: string;
  maxFileSize: number;
};
