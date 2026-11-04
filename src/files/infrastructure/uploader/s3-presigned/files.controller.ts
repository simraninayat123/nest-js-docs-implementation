import { Body, Controller, Post } from '@nestjs/common';
import { FileUploadDto } from './dto/file.dto';
import { FileResponseDto } from './dto/file-response.dto';
import { FilesS3PresignedService } from './files.service';

@Controller('files')
export class FilesS3PresignedController {
  constructor(private readonly filesService: FilesS3PresignedService) {}

  @Post('upload')
  async uploadFile(@Body() file: FileUploadDto): Promise<FileResponseDto> {
    return this.filesService.create(file);
  }
}
