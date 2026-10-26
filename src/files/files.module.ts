import { Module } from '@nestjs/common';
import fileConfig from './config/file.config';
import { FileConfig, FileDriver } from './config/file-config.type';
import { FilesService } from './files.service';
import { RelationalFilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesLocalModule } from './infrastructure/uploader/local/files.module';

const infrastructureUploaderModule = {
  [FileDriver.LOCAL]: FilesLocalModule,
}[(fileConfig() as FileConfig).driver];

@Module({
  imports: [RelationalFilePersistenceModule, infrastructureUploaderModule],
  providers: [FilesService],
  exports: [FilesService, RelationalFilePersistenceModule],
})
export class FilesModule {}
