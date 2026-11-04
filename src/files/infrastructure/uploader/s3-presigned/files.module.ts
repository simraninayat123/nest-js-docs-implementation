import { Module } from '@nestjs/common';
import { RelationalFilePersistenceModule } from '../../persistence/relational/relational-persistence.module';
import { FilesS3PresignedController } from './files.controller';
import { FilesS3PresignedService } from './files.service';

@Module({
  imports: [RelationalFilePersistenceModule],
  controllers: [FilesS3PresignedController],
  providers: [FilesS3PresignedService],
  exports: [FilesS3PresignedService],
})
export class FilesS3PresignedModule {}
