import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/domain/user';
import { AuthService } from './auth.service';
import { AuthMagicLinkConfirmDto } from './dto/auth-magic-link-confirm.dto';
import { AuthMagicLinkDto } from './dto/auth-magic-link.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  @HttpCode(HttpStatus.NO_CONTENT)
  sendMagicLink(@Body() dto: AuthMagicLinkDto): Promise<void> {
    return this.authService.sendMagicLink(dto);
  }

  @Post('magic-link/confirm')
  @HttpCode(HttpStatus.OK)
  confirmMagicLink(
    @Body() dto: AuthMagicLinkConfirmDto,
  ): Promise<LoginResponseDto> {
    return this.authService.confirmMagicLink(dto.hash);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  me(@Request() request: { user: User }): User {
    return request.user;
  }
}
