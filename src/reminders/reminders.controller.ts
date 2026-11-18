import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
} from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../permissions/permission.enum';
import { User } from '../users/domain/user';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { ReminderResponseDto } from './dto/reminder-response.dto';
import { RemindersService } from './reminders.service';

@Controller({ path: 'reminders' })
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  @Auth(Permission.RemindersWrite)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() request: { user: User },
    @Body() dto: CreateReminderDto,
    @I18nLang() language: string,
  ): Promise<ReminderResponseDto> {
    return this.remindersService.create(request.user, dto, language);
  }

  @Get()
  @Auth(Permission.RemindersRead)
  @HttpCode(HttpStatus.OK)
  findAll(@Request() request: { user: User }): Promise<ReminderResponseDto[]> {
    return this.remindersService.findAll(request.user);
  }

  @Get(':id')
  @Auth(Permission.RemindersRead)
  @HttpCode(HttpStatus.OK)
  findOne(
    @Request() request: { user: User },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReminderResponseDto> {
    return this.remindersService.findOne(request.user, id);
  }

  @Delete(':id')
  @Auth(Permission.RemindersWrite)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Request() request: { user: User },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.remindersService.remove(request.user, id);
  }
}
