import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response as ExpressResponse } from 'express';
import { FileResponseDto } from './dto/file-response.dto';
import { FilesLocalService } from './files.service';

@Controller('files')
export class FilesLocalController {
  constructor(private readonly filesService: FilesLocalService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    return this.filesService.create(file);
  }

  @Get(':path')
  download(@Param('path') path: string, @Response() response: ExpressResponse) {
    return response.sendFile(path, { root: './files' });
  }
}
