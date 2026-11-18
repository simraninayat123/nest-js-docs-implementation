import { Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RelationalUserPersistenceModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
