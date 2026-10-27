import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import ms from 'ms';
import { AllConfigType } from '../config/config.type';
import { MailService } from '../mail/mail.service';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthMagicLinkDto } from './dto/auth-magic-link.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { MagicLinkPayloadType } from './types/magic-link-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async sendMagicLink(dto: AuthMagicLinkDto): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email, {
      withDeleted: true,
    });
    if (user?.deletedAt) {
      return;
    }

    const hash = await this.jwtService.signAsync(
      { email: dto.email } satisfies MagicLinkPayloadType,
      {
        secret: this.configService.getOrThrow('auth.magicLinkSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.magicLinkExpires', {
          infer: true,
        }),
      },
    );

    await this.mailService.magicLink({
      to: dto.email,
      data: { hash },
    });
  }

  async confirmMagicLink(hash: string): Promise<LoginResponseDto> {
    const payload = await this.jwtService
      .verifyAsync<MagicLinkPayloadType>(hash, {
        secret: this.configService.getOrThrow('auth.magicLinkSecret', {
          infer: true,
        }),
      })
      .catch(() => null);

    if (
      !payload ||
      typeof payload.email !== 'string' ||
      !isEmail(payload.email)
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: 'invalidHash',
        },
      });
    }

    const email = payload.email.toLowerCase().trim();

    let user = await this.usersService.findByEmail(email, {
      withDeleted: true,
    });

    if (user?.deletedAt) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'userDeleted',
        },
      });
    }

    if (!user) {
      user = await this.createUser(email);
    }

    return this.login(user);
  }

  private async createUser(email: User['email']): Promise<User> {
    try {
      return await this.usersService.create({
        email,
        firstName: null,
        lastName: null,
        provider: AuthProvidersEnum.email,
      });
    } catch (error) {
      const existingUser = await this.usersService.findByEmail(email);
      if (!existingUser) {
        throw error;
      }
      return existingUser;
    }
  }

  private async login(user: User): Promise<LoginResponseDto> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const token = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    );

    return {
      token,
      tokenExpires,
      user,
    };
  }
}
