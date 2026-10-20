import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from '../../../../authors/infrastructure/persistence/relational/entities/author.entity';
import { AuthorSeedService } from './author-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity])],
  providers: [AuthorSeedService],
  exports: [AuthorSeedService],
})
export class AuthorSeedModule {}
