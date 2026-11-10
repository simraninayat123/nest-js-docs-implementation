import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AllConfigType } from '../config/config.type';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';

@Injectable()
export class AuthGoogleService {
  private readonly google = new OAuth2Client();

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    const clientId = this.configService.getOrThrow('google.clientId', {
      infer: true,
    });
    const data = await this.verifyIdToken(loginDto.idToken, clientId);

    if (!data) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          idToken: 'invalidToken',
        },
      });
    }

    return {
      id: data.sub,
      email: data.email,
      emailVerified: data.email_verified === true,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  }

  private async verifyIdToken(
    idToken: string,
    clientId: string,
  ): Promise<TokenPayload | undefined> {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken,
        audience: clientId,
      });
      return ticket.getPayload();
    } catch {
      return undefined;
    }
  }
}
