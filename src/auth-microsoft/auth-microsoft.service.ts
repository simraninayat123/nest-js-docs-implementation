import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';
import { AllConfigType } from '../config/config.type';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthMicrosoftLoginDto } from './dto/auth-microsoft-login.dto';
import { MicrosoftIdTokenClaims } from './interfaces/microsoft.interface';

const TENANT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VERIFIED_EDOV_VALUES: unknown[] = [true, 'true', 1, '1'];

@Injectable()
export class AuthMicrosoftService {
  private readonly jwks = new JwksClient({
    jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
    cache: true,
    rateLimit: true,
  });

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async getProfileByToken(
    loginDto: AuthMicrosoftLoginDto,
  ): Promise<SocialInterface> {
    const clientId = this.configService.getOrThrow('microsoft.clientId', {
      infer: true,
    });
    const claims = await this.verifyIdToken(loginDto.idToken, clientId);

    if (!claims) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          idToken: 'invalidToken',
        },
      });
    }

    return {
      id: claims.sub,
      email: claims.email,
      emailVerified: VERIFIED_EDOV_VALUES.includes(claims.xms_edov),
      firstName: claims.given_name,
      lastName: claims.family_name,
    };
  }

  private async verifyIdToken(
    idToken: string,
    clientId: string,
  ): Promise<MicrosoftIdTokenClaims | null> {
    try {
      const decoded = this.jwtService.decode<{ header?: { kid?: string } }>(
        idToken,
        { complete: true },
      );
      const kid = decoded?.header?.kid;
      if (!kid) {
        return null;
      }

      const signingKey = await this.jwks.getSigningKey(kid);
      const claims = await this.jwtService.verifyAsync<MicrosoftIdTokenClaims>(
        idToken,
        {
          publicKey: signingKey.getPublicKey(),
          algorithms: ['RS256'],
          audience: clientId,
        },
      );

      if (
        !claims.sub ||
        !TENANT_ID_PATTERN.test(claims.tid ?? '') ||
        claims.iss !== `https://login.microsoftonline.com/${claims.tid}/v2.0`
      ) {
        return null;
      }

      return claims;
    } catch {
      return null;
    }
  }
}
