import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneTimeTokenRepository } from '../one-time-token.repository';
import { OneTimeTokenEntity } from './entities/one-time-token.entity';
import { OneTimeTokenRelationalRepository } from './repositories/one-time-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OneTimeTokenEntity])],
  providers: [
    {
      provide: OneTimeTokenRepository,
      useClass: OneTimeTokenRelationalRepository,
    },
  ],
  exports: [OneTimeTokenRepository],
})
export class RelationalOneTimeTokenPersistenceModule {}
