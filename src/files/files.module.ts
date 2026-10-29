import { Module } from '@nestjs/common';
import fileConfig from './config/file.config';
import { FileConfig, FileDriver } from './config/file-config.type';
import { FilesService } from './files.service';
import { RelationalFilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesLocalModule } from './infrastructure/uploader/local/files.module';
import { FilesS3Module } from './infrastructure/uploader/s3/files.module';

const infrastructureUploaderModule = {
  [FileDriver.LOCAL]: FilesLocalModule,
  [FileDriver.S3]: FilesS3Module,
}[(fileConfig() as FileConfig).driver];

@Module({
  imports: [RelationalFilePersistenceModule, infrastructureUploaderModule],
  providers: [FilesService],
  exports: [FilesService, RelationalFilePersistenceModule],
})
export class FilesModule {}
