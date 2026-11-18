import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { User } from '../users/domain/user';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthMagicLinkConfirmDto } from './dto/auth-magic-link-confirm.dto';
import { AuthMagicLinkDto } from './dto/auth-magic-link.dto';
import { AuthOtpConfirmDto } from './dto/auth-otp-confirm.dto';
import { AuthOtpDto } from './dto/auth-otp.dto';
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

  @Post('otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  sendOtp(@Body() dto: AuthOtpDto): Promise<void> {
    return this.authService.sendOtp(dto);
  }

  @Post('otp/confirm')
  @HttpCode(HttpStatus.OK)
  confirmOtp(@Body() dto: AuthOtpConfirmDto): Promise<LoginResponseDto> {
    return this.authService.confirmOtp(dto);
  }

  @Get('me')
  @Auth()
  @HttpCode(HttpStatus.OK)
  me(@Request() request: { user: User }): User {
    return request.user;
  }
}
