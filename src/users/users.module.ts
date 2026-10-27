import { Module } from '@nestjs/common';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersService } from './users.service';

@Module({
  imports: [RelationalUserPersistenceModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
