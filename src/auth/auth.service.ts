import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'node:crypto';
import ms from 'ms';
import { AllConfigType } from '../config/config.type';
import { MailService } from '../mail/mail.service';
import { OneTimeTokenTypeEnum } from '../one-time-tokens/one-time-token-type.enum';
import { OneTimeTokensService } from '../one-time-tokens/one-time-tokens.service';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthMagicLinkDto } from './dto/auth-magic-link.dto';
import { AuthOtpConfirmDto } from './dto/auth-otp-confirm.dto';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly oneTimeTokensService: OneTimeTokensService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async sendMagicLink(dto: AuthMagicLinkDto): Promise<void> {
    if (await this.isUserDeleted(dto.email)) {
      return;
    }

    const hash = randomBytes(32).toString('base64url');
    const expiresIn = this.configService.getOrThrow('auth.magicLinkExpires', {
      infer: true,
    });

    await this.oneTimeTokensService.deleteUnusedByEmail(
      dto.email,
      OneTimeTokenTypeEnum.magicLink,
    );

    await this.oneTimeTokensService.create({
      email: dto.email,
      type: OneTimeTokenTypeEnum.magicLink,
      tokenHash: this.hashToken(hash),
      expiresAt: new Date(Date.now() + ms(expiresIn)),
      usedAt: null,
      attempts: 0,
    });

    await this.mailService.magicLink({
      to: dto.email,
      data: { hash },
    });
  }

  async confirmMagicLink(hash: string): Promise<LoginResponseDto> {
    const oneTimeToken = await this.oneTimeTokensService.findByTokenHash(
      this.hashToken(hash),
      OneTimeTokenTypeEnum.magicLink,
    );

    if (
      !oneTimeToken ||
      !(await this.oneTimeTokensService.markAsUsed(oneTimeToken.id))
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: 'invalidHash',
        },
      });
    }

    return this.login(await this.findOrCreateUser(oneTimeToken.email));
  }

  async sendOtp(dto: AuthOtpDto): Promise<void> {
    if (await this.isUserDeleted(dto.email)) {
      return;
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const expiresIn = this.configService.getOrThrow('auth.otpExpires', {
      infer: true,
    });

    await this.oneTimeTokensService.deleteUnusedByEmail(
      dto.email,
      OneTimeTokenTypeEnum.otp,
    );

    await this.oneTimeTokensService.create({
      email: dto.email,
      type: OneTimeTokenTypeEnum.otp,
      tokenHash: this.hashOtp(dto.email, code),
      expiresAt: new Date(Date.now() + ms(expiresIn)),
      usedAt: null,
      attempts: 0,
    });

    await this.mailService.otp({
      to: dto.email,
      data: { code },
    });
  }

  async confirmOtp(dto: AuthOtpConfirmDto): Promise<LoginResponseDto> {
    const maxAttempts = this.configService.getOrThrow('auth.otpMaxAttempts', {
      infer: true,
    });

    const oneTimeToken =
      await this.oneTimeTokensService.findLatestUnusedByEmail(
        dto.email,
        OneTimeTokenTypeEnum.otp,
      );

    if (oneTimeToken && oneTimeToken.attempts >= maxAttempts) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          code: 'tooManyAttempts',
        },
      });
    }

    if (
      !oneTimeToken ||
      !(await this.oneTimeTokensService.incrementAttempts(
        oneTimeToken.id,
        maxAttempts,
      )) ||
      !this.isSameHash(
        oneTimeToken.tokenHash,
        this.hashOtp(dto.email, dto.code),
      ) ||
      !(await this.oneTimeTokensService.markAsUsed(oneTimeToken.id))
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          code: 'invalidCode',
        },
      });
    }

    return this.login(await this.findOrCreateUser(oneTimeToken.email));
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private hashOtp(email: string, code: string): string {
    return createHmac(
      'sha256',
      this.configService.getOrThrow('auth.otpSecret', { infer: true }),
    )
      .update(`${email}:${code}`)
      .digest('hex');
  }

  private isSameHash(a: string, b: string): boolean {
    const bufferA = Buffer.from(a, 'hex');
    const bufferB = Buffer.from(b, 'hex');
    return (
      bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB)
    );
  }

  private async isUserDeleted(email: User['email']): Promise<boolean> {
    const user = await this.usersService.findByEmail(email, {
      withDeleted: true,
    });
    return !!user?.deletedAt;
  }

  private async findOrCreateUser(email: User['email']): Promise<User> {
    const user = await this.usersService.findByEmail(email, {
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

    return user ?? this.createUser(email);
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
