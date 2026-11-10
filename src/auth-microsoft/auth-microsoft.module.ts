import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthMicrosoftController } from './auth-microsoft.controller';
import { AuthMicrosoftService } from './auth-microsoft.service';

@Module({
  imports: [AuthModule, JwtModule.register({})],
  providers: [AuthMicrosoftService],
  exports: [AuthMicrosoftService],
  controllers: [AuthMicrosoftController],
})
export class AuthMicrosoftModule {}
