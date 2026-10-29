import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponseDto } from './dto/file-response.dto';
import { FilesS3Service } from './files.service';

@Controller('files')
export class FilesS3Controller {
  constructor(private readonly filesService: FilesS3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.MulterS3.File,
  ): Promise<FileResponseDto> {
    return this.filesService.create(file);
  }
}
