import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import {
  FacebookDebugTokenInterface,
  FacebookInterface,
} from './interfaces/facebook.interface';

@Injectable()
export class AuthFacebookService {
  private readonly baseUrl = 'https://graph.facebook.com';
  private readonly apiVersion = 'v23.0';
  private readonly timeoutMs = 10000;

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    const userId = await this.verifyAccessToken(loginDto.accessToken);

    const profile = await this.graphGet<FacebookInterface>(
      `/${this.apiVersion}/me`,
      {
        fields: 'id,email,first_name,last_name',
        access_token: loginDto.accessToken,
      },
    );

    if (!profile?.id || profile.id !== userId) {
      throw this.invalidTokenException();
    }

    return {
      id: profile.id,
      email: profile.email,
      emailVerified: Boolean(profile.email),
      firstName: profile.first_name,
      lastName: profile.last_name,
    };
  }

  private async verifyAccessToken(accessToken: string): Promise<string> {
    const appId = this.configService.getOrThrow('facebook.appId', {
      infer: true,
    });
    const appSecret = this.configService.getOrThrow('facebook.appSecret', {
      infer: true,
    });

    const result = await this.graphGet<FacebookDebugTokenInterface>(
      '/debug_token',
      {
        input_token: accessToken,
        access_token: `${appId}|${appSecret}`,
      },
    );

    if (
      !result?.data?.is_valid ||
      result.data.app_id !== appId ||
      !result.data.user_id
    ) {
      throw this.invalidTokenException();
    }

    return result.data.user_id;
  }

  private async graphGet<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T | null> {
    const url = new URL(path, this.baseUrl);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  }

  private invalidTokenException(): UnprocessableEntityException {
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: {
        accessToken: 'invalidToken',
      },
    });
  }
}
