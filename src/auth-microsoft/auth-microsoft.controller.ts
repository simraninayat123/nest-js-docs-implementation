import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
import { AuthMicrosoftService } from './auth-microsoft.service';
import { AuthMicrosoftLoginDto } from './dto/auth-microsoft-login.dto';

@Controller({ path: 'auth/microsoft' })
export class AuthMicrosoftController {
  constructor(
    private readonly authService: AuthService,
    private readonly authMicrosoftService: AuthMicrosoftService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthMicrosoftLoginDto,
  ): Promise<LoginResponseDto> {
    const socialData =
      await this.authMicrosoftService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin(
      AuthProvidersEnum.microsoft,
      socialData,
    );
  }
}
